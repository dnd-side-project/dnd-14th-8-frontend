import type { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("backend readiness", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-29T00:00:00Z"));
    vi.stubEnv("VITE_API_READINESS_CHECK", "true");
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com/");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const healthy = () => new Response(JSON.stringify({ status: "UP" }));

  it("shares one probe across concurrent API requests and caches success briefly", async () => {
    const fetchMock = vi.fn().mockResolvedValue(healthy());
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady } = await import(
      "@/shared/utils/backend-readiness"
    );
    await Promise.all([
      ensureBackendReady(),
      ensureBackendReady(),
      ensureBackendReady(),
    ]);
    await ensureBackendReady();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example.com/actuator/health/readiness",
    );
  });

  it("waits through HTML and unavailable responses before allowing API calls", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("<html>Starting</html>"))
      .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
      .mockResolvedValueOnce(healthy());
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady, getBackendStatus } = await import(
      "@/shared/utils/backend-readiness"
    );
    let released = false;
    const pending = ensureBackendReady().then(() => {
      released = true;
    });
    await vi.advanceTimersByTimeAsync(2_000);
    expect(released).toBe(false);
    expect(getBackendStatus()).toBe("connecting");
    await vi.advanceTimersByTimeAsync(2_000);
    await pending;
    expect(released).toBe(true);
    expect(getBackendStatus()).toBe("ready");
  });

  it("checks again on the next API request after being idle without background pings", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => healthy());
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady } = await import(
      "@/shared/utils/backend-readiness"
    );
    await ensureBackendReady();
    await vi.advanceTimersByTimeAsync(16 * 60_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await ensureBackendReady();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("stops after five minutes and does not restart retries until the user reloads", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Offline"));
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady, getBackendStatus } = await import(
      "@/shared/utils/backend-readiness"
    );
    const result = expect(ensureBackendReady()).rejects.toThrow(
      "서버에 연결하지 못했습니다",
    );
    await vi.advanceTimersByTimeAsync(300_000);
    await result;
    expect(getBackendStatus()).toBe("error");
    const attempts = fetchMock.mock.calls.length;
    await expect(ensureBackendReady()).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(attempts);
  });

  it("sends a mutation exactly once after readiness succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("Starting", { status: 503 }))
        .mockResolvedValueOnce(healthy()),
    );
    const { createAxiosInstance } = await import("@/shared/utils/axios");
    const instance = createAxiosInstance();
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ({
      data: { data: "meeting-id" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    instance.defaults.adapter = adapter;
    const submission = instance.post("/api/meetings", { participantCount: 2 });
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2_000);
    await submission;
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it("warms up the server in the background without showing the connecting screen", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("Starting", { status: 503 }))
      .mockResolvedValueOnce(healthy());
    vi.stubGlobal("fetch", fetchMock);
    const { getBackendStatus, warmUpBackend } = await import(
      "@/shared/utils/backend-readiness"
    );
    warmUpBackend();
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getBackendStatus()).toBe("idle");
    await vi.advanceTimersByTimeAsync(2_000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(getBackendStatus()).toBe("idle");
  });

  it("lets an API request join the warm-up probe and shows connecting only while it waits", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("Starting", { status: 503 }))
      .mockResolvedValueOnce(healthy());
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady, getBackendStatus, warmUpBackend } =
      await import("@/shared/utils/backend-readiness");
    warmUpBackend();
    await vi.advanceTimersByTimeAsync(0);
    const request = ensureBackendReady();
    expect(getBackendStatus()).toBe("connecting");
    await vi.advanceTimersByTimeAsync(2_000);
    await request;
    expect(getBackendStatus()).toBe("ready");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("skips the check on the next API request when the warm-up already succeeded", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => healthy());
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady, getBackendStatus, warmUpBackend } =
      await import("@/shared/utils/backend-readiness");
    warmUpBackend();
    await vi.advanceTimersByTimeAsync(0);
    await ensureBackendReady();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getBackendStatus()).toBe("idle");
  });

  it("does not remember a failed warm-up so the next API request checks again", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Offline"));
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady, getBackendStatus, warmUpBackend } =
      await import("@/shared/utils/backend-readiness");
    warmUpBackend();
    await vi.advanceTimersByTimeAsync(300_000);
    expect(getBackendStatus()).toBe("idle");
    const attempts = fetchMock.mock.calls.length;
    fetchMock.mockImplementation(async () => healthy());
    await ensureBackendReady();
    expect(fetchMock).toHaveBeenCalledTimes(attempts + 1);
    expect(getBackendStatus()).toBe("ready");
  });

  it("does nothing when readiness checks are disabled", async () => {
    vi.stubEnv("VITE_API_READINESS_CHECK", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { ensureBackendReady } = await import(
      "@/shared/utils/backend-readiness"
    );
    await ensureBackendReady();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
