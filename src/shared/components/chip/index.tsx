import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export const chipVariants = cva(
  "inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap bg-k-50",
  {
    variants: {
      size: {
        sm: "rounded-sm px-1 py-px text-c2 text-k-600",
        md: "rounded-md px-3 py-1.5 text-b4 text-k-700",
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
