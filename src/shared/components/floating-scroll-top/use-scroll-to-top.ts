import { useCallback } from "react";

export function useScrollToTop() {
  const scroll = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ behavior: "smooth", top: 0 });
  }, []);

  return { scroll };
}
