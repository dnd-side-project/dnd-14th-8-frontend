import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface FixedBottomAreaProps {
  children: ReactNode;
  /** 하단 영역 위쪽 끝에서 20px, 오른쪽에서 20px 띄워 배치한다. (FloatingButton 배치 가이드) */
  floating?: ReactNode;
  className?: string;
}

/** 모바일 컨테이너 폭에 맞춰 화면 하단에 고정한다. 높이가 바뀌어도 floating이 함께 따라간다. */
export function FixedBottomArea({
  children,
  floating,
  className,
}: FixedBottomAreaProps) {
  return (
    <div
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
