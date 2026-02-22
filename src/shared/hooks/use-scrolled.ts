import { debounce } from "es-toolkit/function";
import { useEffect, useState } from "react";

export function useScrolled({ top }: { top: number }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = debounce(() => {
      setScrolled(document.documentElement.scrollTop >= top);
    }, 100);

    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", onScroll);
      onScroll.cancel();
    };
  }, [top]);

  return { scrolled };
}
