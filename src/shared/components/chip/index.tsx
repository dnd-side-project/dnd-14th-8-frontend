import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export const chipVariants = cva(
  "inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap bg-k-50",
  {
    variants: {
      size: {
        sm: "textStyle_caption2 rounded-sm px-1 py-px text-k-600",
        md: "textStyle_body5 rounded-sm bg-p-50 px-1.5 py-0.5 text-primary-main",
        lg: "textStyle_body4 rounded-sm px-2 py-1 text-k-800",
        xl: "textStyle_body4 rounded-md px-3 py-1.5 text-k-700",
        "2xl": "textStyle_body4 rounded-[30px] bg-k-5 px-3.5 py-2 text-k-700",
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

Chip.Highlight = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("ml-1 font-semibold text-primary-main", className)}>
      {children}
    </span>
  );
};
