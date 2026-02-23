import type { ButtonHTMLAttributes } from "react";
import { ChevronLeftIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface FloatingBackProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function FloatingBack({
  className,
  type = "button",
  ...props
}: FloatingBackProps) {
  return (
    <button
      aria-label="뒤로 이동"
      className={cn(
        "inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-k-5 text-k-700 shadow-[0_0_4px_0_rgba(0,0,0,0.25)]",
        className,
      )}
      type={type}
      {...props}
    >
      <ChevronLeftIcon aria-hidden className="size-9 shrink-0" />
    </button>
  );
}
