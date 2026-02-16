import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

const chipButtonVariants = cva(
  "inline-flex w-fit shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md transition-colors",
  {
    variants: {
      size: {
        sm: "px-2.5 py-1 text-b4",
        md: "px-3.5 py-2 text-b4",
        lg: "px-3 py-2.5 text-b3",
      },
      variant: {
        primary: "bg-p-50 text-primary-main hover:bg-p-100 active:bg-p-200",
        outlined: "border border-k-100 bg-k-5 text-k-500",
        selected: "border border-primary-main bg-p-50 text-primary-main",
        ghost: "bg-k-5 text-primary-main hover:bg-k-10 active:bg-k-50",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "primary",
    },
  },
);

export interface ChipButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof chipButtonVariants>, "variant"> {
  size?: NonNullable<VariantProps<typeof chipButtonVariants>["size"]>;
  variant?: NonNullable<VariantProps<typeof chipButtonVariants>["variant"]>;
}

export function ChipButton({
  className,
  size,
  type = "button",
  variant = "primary",
  ...props
}: ChipButtonProps) {
  return (
    <button
      className={cn(chipButtonVariants({ size, variant }), className)}
      type={type}
      {...props}
    />
  );
}
