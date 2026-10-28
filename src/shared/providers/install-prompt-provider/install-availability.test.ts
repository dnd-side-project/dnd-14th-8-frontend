import { describe, expect, it } from "vitest";
import {
  parseDismissedAt,
  resolveInstallPromptMode,
} from "@/shared/providers/install-prompt-provider/install-availability";

const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
const IOS_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const KAKAOTALK_IN_APP =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 10.4.5";
const DESKTOP_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const NOW = 1_700_000_000_000;
const DAY_MS = 24 * 60 * 60 * 1000;

function context(
  overrides: Partial<Parameters<typeof resolveInstallPromptMode>[0]> = {},
) {
  return {
    dismissedAt: null,
    hasDeferredPrompt: false,
    isStandalone: false,
    now: NOW,
    userAgent: ANDROID_CHROME,
    ...overrides,
  };
}

describe("resolveInstallPromptMode", () => {
  it("offers the native install prompt once the browser hands one over", () => {
    expect(resolveInstallPromptMode(context({ hasDeferredPrompt: true }))).toBe(
      "prompt",
    );
  });

  it("falls back to the manual guide on iOS Safari, which never fires the event", () => {
    expect(resolveInstallPromptMode(context({ userAgent: IOS_SAFARI }))).toBe(
      "guide",
    );
  });

  it("stays hidden when the app already runs from the home screen", () => {
    expect(
      resolveInstallPromptMode(
        context({ hasDeferredPrompt: true, isStandalone: true }),
      ),
    ).toBe("hidden");
  });

  it("stays hidden inside in-app browsers that cannot install", () => {
    expect(
      resolveInstallPromptMode(context({ userAgent: KAKAOTALK_IN_APP })),
    ).toBe("hidden");
  });

  it("stays hidden on desktop browsers without a deferred prompt", () => {
    expect(
      resolveInstallPromptMode(context({ userAgent: DESKTOP_CHROME })),
    ).toBe("hidden");
  });

  it("stays hidden while a recent dismissal is still in effect", () => {
    expect(
      resolveInstallPromptMode(
        context({
          dismissedAt: NOW - 13 * DAY_MS,
          hasDeferredPrompt: true,
        }),
      ),
    ).toBe("hidden");
  });

  it("offers the prompt again once the dismissal has expired", () => {
    expect(
      resolveInstallPromptMode(
        context({
          dismissedAt: NOW - 15 * DAY_MS,
          hasDeferredPrompt: true,
        }),
      ),
    ).toBe("prompt");
  });
});

describe("parseDismissedAt", () => {
  it("reads back a stored timestamp", () => {
    expect(parseDismissedAt(String(NOW))).toBe(NOW);
  });

  it("treats a missing record as never dismissed", () => {
    expect(parseDismissedAt(null)).toBeNull();
  });

  it("treats a corrupted record as never dismissed", () => {
    expect(parseDismissedAt("나중에")).toBeNull();
  });
});
