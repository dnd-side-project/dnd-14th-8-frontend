import { useCallback, useEffect, useState } from "react";

const SHARE_SHEET_TRANSITION_MS = 300;

export function useShareSheetState() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const share = useCallback(() => {
    if (isMounted) {
      setIsOpen(true);
      return;
    }

    setIsMounted(true);
  }, [isMounted]);

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

  useEffect(() => {
    if (!isMounted || isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsMounted(false);
    }, SHARE_SHEET_TRANSITION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMounted, isOpen]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const originalOverflow = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMounted]);

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

  return {
    close,
    isMounted,
    isOpen,
    share,
  };
}
