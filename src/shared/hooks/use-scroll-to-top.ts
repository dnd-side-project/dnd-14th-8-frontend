import type { RefObject } from "react";
import { useCallback } from "react";

export interface UseScrollToTopOptions {
  behavior?: ScrollBehavior;
  left?: number;
  targetRef?: RefObject<HTMLElement | null>;
  top?: number;
}

export function useScrollToTop({
  behavior = "smooth",
  left = 0,
  targetRef,
  top = 0,
}: UseScrollToTopOptions = {}) {
  return useCallback(() => {
    const scrollTarget = targetRef?.current;

    if (scrollTarget) {
      scrollTarget.scrollTo({ behavior, left, top });
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ behavior, left, top });
  }, [behavior, left, targetRef, top]);
}
