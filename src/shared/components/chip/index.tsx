import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export const chipVariants = cva(
  "inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap bg-fill-neutral-subtler",
  {
    variants: {
      size: {
        sm: "textStyle_caption2 rounded-sm px-1 py-px text-fg-neutral-subtle",
        md: "textStyle_body5 rounded-sm bg-fill-brand-subtle px-1.5 py-0.5 text-fg-brand-default",
        lg: "textStyle_body4 rounded-sm px-2 py-1 text-fg-neutral-strong",
        xl: "textStyle_body4 rounded-md px-3 py-1.5 text-fg-neutral-default",
        "2xl":
          "textStyle_body4 rounded-[30px] bg-fill-neutral-faintest px-3.5 py-2 text-fg-neutral-default",
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
    <span className={cn("ml-1 font-semibold text-fg-brand-default", className)}>
      {children}
    </span>
  );
};
