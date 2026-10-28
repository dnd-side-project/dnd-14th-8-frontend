export type BackendStatus = "idle" | "connecting" | "ready" | "error";

const MAX_WAIT_MS = 300_000;
const PROBE_TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 2_000;
const READY_CACHE_MS = 30_000;
const listeners = new Set<() => void>();
let status: BackendStatus = "idle";
let readyAt = 0;
let pending: Promise<void> | null = null;
let failure: Error | null = null;

export function getBackendStatus(): BackendStatus {
  return status;
}

export function subscribeBackendStatus(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setStatus(next: BackendStatus) {
  status = next;
  for (const listener of listeners) listener();
}

// API 요청 직전에만 확인한다. 주기적인 ping으로 무료 서버를 깨워 두지 않는다.
export function ensureBackendReady(): Promise<void> {
  if (import.meta.env.VITE_API_READINESS_CHECK !== "true") {
    return Promise.resolve();
  }
  if (status === "ready" && Date.now() - readyAt < READY_CACHE_MS) {
    return Promise.resolve();
  }
  if (pending) return pending;
  if (failure) return Promise.reject(failure);

  setStatus("connecting");
  pending = probeUntilReady()
    .then(() => {
      readyAt = Date.now();
      setStatus("ready");
    })
    .catch((error: Error) => {
      failure = error;
      setStatus("error");
      throw error;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

async function probeUntilReady(): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("API 주소가 설정되지 않았습니다.");
  const deadline = Date.now() + MAX_WAIT_MS;

  while (Date.now() < deadline) {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      Math.min(PROBE_TIMEOUT_MS, deadline - Date.now()),
    );
    try {
      const response = await fetch(`${baseUrl}/actuator/health/readiness`, {
        signal: controller.signal,
        cache: "no-store",
        credentials: "omit",
      });
      if (response.ok) {
        const body = await response.json();
        // Render가 반환하는 HTML 대기 페이지를 준비 완료로 취급하지 않는다.
        if (body?.status === "UP") return;
      }
    } catch {
      // 기동 중의 네트워크 오류, timeout, HTML 응답은 제한 시간 내 재확인한다.
    } finally {
      clearTimeout(timer);
    }

    const remaining = deadline - Date.now();
    if (remaining > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(RETRY_DELAY_MS, remaining)),
      );
    }
  }
  throw new Error("서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
}
