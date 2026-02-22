import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export const chipVariants = cva(
  "inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap bg-k-50",
  {
    variants: {
      size: {
        sm: "rounded-sm px-1 py-px text-c2 text-k-600",
        md: "rounded-sm bg-p-50 px-1.5 py-0.5 text-b5 text-primary-main",
        lg: "rounded-sm px-2 py-1 text-b4 text-k-800",
        xl: "rounded-md px-3 py-1.5 text-b4 text-k-700",
        "2xl": "roundes-[30px] px-3.5 py-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface ChipProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ children, className, size, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ size }), className)} {...props}>
      {children}
    </span>
  );
}
