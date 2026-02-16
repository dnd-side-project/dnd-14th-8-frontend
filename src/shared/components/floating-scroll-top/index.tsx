import type { ButtonHTMLAttributes } from "react";
import { ArrowUpIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface FloatingScrollTopProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function FloatingScrollTop({
  className,
  type = "button",
  ...props
}: FloatingScrollTopProps) {
  return (
    <button
      aria-label="맨 위로 이동"
      className={cn(
        "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-k-200 bg-k-5 text-k-700 shadow-[0_4px_8px_0_rgba(0,0,0,0.06)] transition-colors hover:bg-k-50",
        "active:border-transparent active:bg-primary-main active:text-k-5 active:hover:bg-p-450",
        className,
      )}
      type={type}
      {...props}
    >
      <ArrowUpIcon aria-hidden className="size-6 shrink-0" />
    </button>
  );
}
