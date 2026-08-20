export type InstallPromptMode = "guide" | "hidden" | "prompt";

interface InstallPromptContext {
  dismissedAt: number | null;
  hasDeferredPrompt: boolean;
  isStandalone: boolean;
  now: number;
  userAgent: string;
}

export const INSTALL_PROMPT_DISMISS_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * 카카오톡 공유로 유입되는 트래픽이 많은데, 인앱 브라우저에는
 * 홈 화면 추가 메뉴 자체가 없어 안내해도 따라갈 수 없다.
 */
const IN_APP_BROWSER_PATTERN =
  /KAKAOTALK|Instagram|Line\/|NAVER|FB[AS]V|DaumApps/i;

function isIos(userAgent: string) {
  return /iPhone|iPad|iPod/i.test(userAgent);
}

export function resolveInstallPromptMode({
  dismissedAt,
  hasDeferredPrompt,
  isStandalone,
  now,
  userAgent,
}: InstallPromptContext): InstallPromptMode {
  if (isStandalone) {
    return "hidden";
  }

  if (IN_APP_BROWSER_PATTERN.test(userAgent)) {
    return "hidden";
  }

  if (dismissedAt !== null && now - dismissedAt < INSTALL_PROMPT_DISMISS_MS) {
    return "hidden";
  }

  if (hasDeferredPrompt) {
    return "prompt";
  }

  return isIos(userAgent) ? "guide" : "hidden";
}

export function parseDismissedAt(raw: string | null): number | null {
  if (raw === null) {
    return null;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}
