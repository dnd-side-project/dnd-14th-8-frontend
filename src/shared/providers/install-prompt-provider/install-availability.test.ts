import { describe, expect, it } from "vitest";
import {
  parseDismissedAt,
  resolveInstallPromptMode,
  resolveShareStep,
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

// iOS 18.5, 26.3 Safari 값은 시뮬레이터에서 기록했다(2026-11-27). iOS 26부터 OS 버전이 18.x로 고정된다.
const IOS_18_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const IOS_26_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1";
// iOS 27 시뮬레이터가 없어 확인하지 못한 값이다. iOS 26과 같은 형식이라고 가정했다.
const IOS_27_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1";
// iOS Chrome은 Version 토큰 없이 CriOS를 붙인다. 직접 기록한 값은 아니다.
const IOS_CHROME =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.0.0 Mobile/15E148 Safari/604.1";

describe("resolveShareStep", () => {
  it("points to the toolbar Share button up to iOS 18 Safari", () => {
    expect(resolveShareStep(IOS_18_SAFARI)).toBe("toolbar");
    expect(resolveShareStep(IOS_SAFARI)).toBe("toolbar");
  });

  it("reads the Safari version, not the frozen OS version, on iOS 26", () => {
    expect(resolveShareStep(IOS_26_SAFARI)).toBe("more");
  });

  it("points to the page menu from iOS 27 Safari onward", () => {
    expect(resolveShareStep(IOS_27_SAFARI)).toBe("pageMenu");
    expect(
      resolveShareStep(IOS_27_SAFARI.replace("Version/27.0", "Version/28.1")),
    ).toBe("pageMenu");
  });

  it("falls back to a generic step on other iOS browsers", () => {
    expect(resolveShareStep(IOS_CHROME)).toBe("other");
    expect(resolveShareStep(KAKAOTALK_IN_APP)).toBe("other");
  });
});
