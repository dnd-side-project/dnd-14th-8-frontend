import { useCallback, useEffect, useRef, useState } from "react";
import {
  type InstallPromptMode,
  parseDismissedAt,
  resolveInstallPromptMode,
} from "@/shared/providers/install-prompt-provider/install-availability";

/** beforeinstallprompt는 아직 표준이 아니라 lib.dom에 타입이 없다. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * index.html의 인라인 스크립트가 번들 실행 전에 붙잡아둔 이벤트.
 * 크롬은 리액트가 마운트되기 전에도 이 이벤트를 쏠 수 있어 여기서 넘겨받는다.
 */
declare global {
  interface Window {
    __moyeorakInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

const DEFERRED_PROMPT_EVENT = "moyeorak:installprompt";
const DISMISSED_AT_STORAGE_KEY = "moyeorak:install-prompt-dismissed-at";
const SHEET_TRANSITION_MS = 300;
const APPEAR_DELAY_MS = 3000;

function readDismissedAt() {
  try {
    return parseDismissedAt(
      window.localStorage.getItem(DISMISSED_AT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

function writeDismissedAt(dismissedAt: number) {
  try {
    window.localStorage.setItem(DISMISSED_AT_STORAGE_KEY, String(dismissedAt));
  } catch {
    // 사파리 프라이빗 모드 등 저장이 막힌 환경에서는 재노출을 감수한다.
  }
}

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function useInstallPromptState(isEnabled: boolean) {
  const [deferredPrompt, setDeferredPrompt] = useState(
    () => window.__moyeorakInstallPrompt,
  );
  const [isDelayElapsed, setIsDelayElapsed] = useState(false);
  const [mode, setMode] = useState<InstallPromptMode>("hidden");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasShownRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  /**
   * 닫힘은 명시적인 동작으로만 일어난다. `isOpen === false`를 언마운트 근거로 삼으면
   * "아직 열리기 전"과 "닫힌 뒤"가 구분되지 않아, requestAnimationFrame이 멈추는
   * 백그라운드 탭에서 시트가 열려보지도 못하고 사라진다.
   */
  const hide = useCallback(() => {
    setIsOpen(false);

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsMounted(false);
    }, SHEET_TRANSITION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleDeferredPrompt = () => {
      setDeferredPrompt(window.__moyeorakInstallPrompt);
    };

    window.addEventListener(DEFERRED_PROMPT_EVENT, handleDeferredPrompt);

    return () => {
      window.removeEventListener(DEFERRED_PROMPT_EVENT, handleDeferredPrompt);
    };
  }, []);

  useEffect(() => {
    const handleAppInstalled = () => {
      window.__moyeorakInstallPrompt = null;
      setDeferredPrompt(null);
      hide();
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [hide]);

  useEffect(() => {
    if (!isEnabled || isDelayElapsed) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsDelayElapsed(true);
    }, APPEAR_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isDelayElapsed, isEnabled]);

  useEffect(() => {
    if (!isEnabled || !isDelayElapsed || hasShownRef.current) {
      return;
    }

    const nextMode = resolveInstallPromptMode({
      dismissedAt: readDismissedAt(),
      hasDeferredPrompt: deferredPrompt !== null,
      isStandalone: isRunningStandalone(),
      now: Date.now(),
      userAgent: navigator.userAgent,
    });

    if (nextMode === "hidden") {
      return;
    }

    hasShownRef.current = true;
    setMode(nextMode);
    setIsMounted(true);
  }, [deferredPrompt, isDelayElapsed, isEnabled]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsOpen(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isMounted]);

  const close = useCallback(() => {
    writeDismissedAt(Date.now());
    hide();
  }, [hide]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isMounted]);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    hide();
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "dismissed") {
      writeDismissedAt(Date.now());
    }

    // 한 번 소비한 이벤트는 재사용할 수 없다.
    window.__moyeorakInstallPrompt = null;
    setDeferredPrompt(null);
  }, [deferredPrompt, hide]);

  return {
    close,
    install,
    isMounted,
    isOpen,
    mode,
  };
}
