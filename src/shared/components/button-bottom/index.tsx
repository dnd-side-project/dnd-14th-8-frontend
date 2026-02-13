import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export const buttonBottomVariants = cva(
  cn(
    "inline-flex h-[54px] w-full cursor-pointer items-center justify-center rounded-lg border px-5 text-t2 transition-colors",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-k-100 disabled:text-k-400",
  ),
  {
    variants: {
      variant: {
        black:
          "border-transparent bg-k-800 text-white enabled:active:bg-k-700 enabled:active:text-k-200 enabled:hover:bg-k-750",
        blue: "border-transparent bg-primary-main text-white enabled:active:bg-p-500 enabled:hover:bg-p-450",
        white:
          "border-k-200 bg-k-5 text-k-800 enabled:active:bg-k-50 enabled:hover:bg-k-10",
      },
    },
    defaultVariants: {
      variant: "black",
    },
  },
);

export interface ButtonBottomProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonBottomVariants> {}

export function ButtonBottom({
  className,
  type = "button",
  variant,
  ...props
}: ButtonBottomProps) {
  return (
    <button
      className={cn(buttonBottomVariants({ variant }), className)}
      type={type}
      {...props}
    />
  );
}
