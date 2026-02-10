import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center transition-colors disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "w-full rounded-lg bg-k-800 text-t2 text-white disabled:bg-k-400",
        blue: "w-full rounded-lg bg-primary-main text-t2 text-white",
        secondary: "rounded-lg bg-k-100 text-b4 text-k-700",
        ghost: "text-b4 text-k-500",
        icon: "rounded-lg",
      },
      size: {
        lg: "h-[54px] px-6",
        md: "h-12 px-4",
        sm: "h-9 px-3",
        icon: "size-[54px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

function Button({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
