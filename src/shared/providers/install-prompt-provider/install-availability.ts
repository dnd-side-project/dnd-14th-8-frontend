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

/**
 * 단계 안내 1단계에서 공유를 어디서 찾는지. Safari 버전마다 다르다(Apple iPhone 사용 설명서, #293).
 * - toolbar: iOS 18 이하. 아래 막대의 공유 버튼
 * - more: iOS 26. 더 보기 버튼(점 세 개)을 누른 다음 공유
 * - pageMenu: iOS 27 이상. 주소창 왼쪽의 페이지 메뉴 버튼을 누른 다음 공유
 * - other: Safari가 아닌 브라우저. 메뉴 위치를 알 수 없다
 * 탭 레이아웃(하단, 상단)은 사용자 에이전트로 알 수 없어 나누지 않는다.
 */
export type ShareStep = "toolbar" | "more" | "pageMenu" | "other";

/**
 * iOS의 다른 브라우저가 사용자 에이전트에 붙이는 이름이다.
 * 이 이름이 있으면 Safari 메뉴를 기준으로 안내할 수 없다.
 */
const OTHER_IOS_BROWSER_PATTERN = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//;

/**
 * iOS 26부터 Safari는 사용자 에이전트의 OS 버전을 18.x로 고정한다.
 * 그래서 OS 버전 대신 실제 버전을 따르는 Safari 버전(Version/N)으로 나눈다.
 */
export function resolveShareStep(userAgent: string): ShareStep {
  const safariVersion = /Version\/(\d+)/.exec(userAgent);

  if (!safariVersion || OTHER_IOS_BROWSER_PATTERN.test(userAgent)) {
    return "other";
  }

  const major = Number(safariVersion[1]);

  if (major < 26) {
    return "toolbar";
  }

  return major === 26 ? "more" : "pageMenu";
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
