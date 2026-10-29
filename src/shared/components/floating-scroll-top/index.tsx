import { FloatingButton } from "@moyeorak/design-system";
import {
  type HTMLAttributes,
  type TransitionEvent,
  useEffect,
  useState,
} from "react";
import { useScrollToTop } from "@/shared/hooks/use-scroll-to-top";
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
        "transition-[opacity,transform] duration-200 ease-out",
        isVisible && "pointer-events-auto opacity-100",
        !isVisible && "pointer-events-none opacity-0",
        className,
      )}
      {...props}
    >
      <FloatingButton
        type="up"
        onClick={scroll}
        aria-label="맨 위로 이동"
        tabIndex={isVisible ? 0 : -1}
        className="static focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2"
      />
    </div>
  );
}
