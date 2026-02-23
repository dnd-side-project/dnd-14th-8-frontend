import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonSubStorkeProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export function ButtonSubStorke({
  children,
  className,
  icon,
  type = "button",
  ...props
}: ButtonSubStorkeProps) {
  return (
    <button
      className={cn(
        "inline-flex h-[49px] w-full cursor-pointer items-center justify-center rounded-md border border-k-100 bg-k-5 px-4 text-b4 text-k-750 leading-none",
        className,
      )}
      type={type}
      {...props}
    >
      {icon && (
        <span
          aria-hidden
          className="inline-flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}

      <span className="flex items-center">{children}</span>
    </button>
  );
}
