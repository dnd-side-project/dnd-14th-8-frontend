import {
  type HTMLAttributes,
  type TransitionEvent,
  useEffect,
  useState,
} from "react";
import { useScrollToTop } from "@/shared/components/floating-scroll-top/use-scroll-to-top";
import { ArrowUpIcon } from "@/shared/components/icons";
import { useScrolled } from "@/shared/hooks/use-scrolled";
import { cn } from "@/shared/utils/cn";

export interface FloatingScrollTopProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  top?: number;
}

export function FloatingScrollTop({
  top = 20,
  onTransitionEnd,
  className,
  ...props
}: FloatingScrollTopProps) {
  const { scroll } = useScrollToTop();
  const { scrolled } = useScrolled({ top });

  const [isRendered, setIsRendered] = useState(scrolled);
  const [isVisible, setIsVisible] = useState(scrolled);

  useEffect(() => {
    if (scrolled) {
      setIsRendered(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setIsVisible(false);
  }, [scrolled]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (!isVisible) {
      setIsRendered(false);
    }
    onTransitionEnd?.(event);
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div
      aria-hidden={!isVisible}
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        "fixed right-0 left-0 z-20 mx-auto flex w-full max-w-[375px] justify-end px-5 transition-[opacity,transform] duration-200 ease-out",
        isVisible && "pointer-events-auto opacity-100",
        !isVisible && "pointer-events-none opacity-0",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={scroll}
        aria-label="맨 위로 이동"
        tabIndex={isVisible ? 0 : -1}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-k-200 bg-k-5 text-k-700 shadow-[0_4px_8px_0_rgba(0,0,0,0.06)] transition-colors enabled:cursor-pointer",
          "enabled:active:border-transparent enabled:active:bg-primary-main enabled:active:text-k-5 enabled:hover:bg-k-50",
        )}
      >
        <ArrowUpIcon aria-hidden className="size-6 shrink-0" />
      </button>
    </div>
  );
}
