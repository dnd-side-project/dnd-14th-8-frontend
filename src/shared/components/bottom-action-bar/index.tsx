import type { HTMLAttributes } from "react";
import { useScrolled } from "@/shared/hooks/use-scrolled";
import { cn } from "@/shared/utils/cn";

export type BottomActionBarTone = "solid" | "scroll-solid";

export interface BottomActionBarProps extends HTMLAttributes<HTMLDivElement> {
  tone?: BottomActionBarTone;
}

export function BottomActionBar({
  tone = "solid",
  className,
  ...props
}: BottomActionBarProps) {
  const { scrolled } = useScrolled({
    top: tone === "scroll-solid" ? 1 : 0,
  });

  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-30 mx-auto w-full max-w-[375px] px-5 pt-3 pb-3 transition-colors",
        tone === "solid" || scrolled
          ? "border-k-50 border-t bg-k-5"
          : "bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
