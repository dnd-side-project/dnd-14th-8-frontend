import { type ReactNode, useLayoutEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";

const HEIGHT_VARIABLE = "--fixed-bottom-area-height";

/**
 * FixedBottomArea에 가려지지 않도록 스크롤 콘텐츠 끝에 줄 하단 여백.
 * 하단 영역 높이 + floating 영역(위 여백 20px + 버튼 40px + 아래 여백 20px).
 */
export const FIXED_BOTTOM_AREA_PADDING_WITH_FLOATING =
  "pb-[calc(var(--fixed-bottom-area-height,0px)+80px)]";

export interface FixedBottomAreaProps {
  children: ReactNode;
  /** 하단 영역 위쪽 끝에서 20px, 오른쪽에서 20px 띄워 배치한다. (FloatingButton 배치 가이드) */
  floating?: ReactNode;
  className?: string;
}

/**
 * 모바일 컨테이너 폭에 맞춰 화면 하단에 고정한다. 높이가 바뀌어도 floating이 함께 따라가고,
 * 현재 높이를 --fixed-bottom-area-height로 알려 콘텐츠 여백이 따라가게 한다.
 */
export function FixedBottomArea({
  children,
  floating,
  className,
}: FixedBottomAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const root = document.documentElement;
    const update = () =>
      root.style.setProperty(HEIGHT_VARIABLE, `${element.offsetHeight}px`);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      observer.disconnect();
      root.style.removeProperty(HEIGHT_VARIABLE);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 mx-auto w-full sm:max-w-[375px]",
        className,
      )}
    >
      {floating && (
        <div className="pointer-events-none absolute inset-x-0 bottom-full flex justify-end px-5 pb-5">
          {floating}
        </div>
      )}
      {children}
    </div>
  );
}
