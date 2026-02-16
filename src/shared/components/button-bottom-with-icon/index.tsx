import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonBottomWithIconProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export function ButtonBottomWithIcon({
  children,
  className,
  icon,
  type = "button",
  ...props
}: ButtonBottomWithIconProps) {
  return (
    <button
      className={cn(
        "inline-flex h-[45px] w-full items-center justify-center gap-1.5 rounded-lg border border-k-200 bg-white px-4 text-b3 text-k-800 transition-colors enabled:cursor-pointer disabled:cursor-default",
        "enabled:active:bg-k-50 enabled:hover:bg-k-10",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center justify-center"
      >
        {icon}
      </span>
    </button>
  );
}
