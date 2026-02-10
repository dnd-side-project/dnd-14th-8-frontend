import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "border border-k-200 bg-white text-c1 text-k-700",
        selected: "bg-primary-main text-c1 text-white",
        primary: "bg-p-50 text-c1 text-primary-main",
        outline: "border border-k-200 text-c1 text-k-600",
      },
      size: {
        sm: "h-8 px-4",
        md: "h-8 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  as?: "span" | "button";
}

function Badge({
  variant,
  size,
  className,
  children,
  as: Tag = "span",
  ...props
}: BadgeProps) {
  return (
    <Tag
      className={cn(
        badgeVariants({ variant, size }),
        Tag === "button" && "cursor-pointer",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </Tag>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
