import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const chipButtonWithIconVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-b4 transition-all",
  {
    variants: {
      status: {
        selected: "bg-primary-main text-k-5",
        unselected: "bg-k-5 text-k-500",
      },
      shadow: {
        on: "shadow-[0_0_4px_rgba(0,0,0,0.25)]",
        off: "",
      },
    },
    compoundVariants: [
      {
        status: "unselected",
        shadow: "off",
        className: "border border-k-100",
      },
    ],
    defaultVariants: {
      status: "unselected",
      shadow: "off",
    },
  },
);

export interface ChipButtonWithIconProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipButtonWithIconVariants> {
  icon: ReactNode;
}

export function ChipButtonWithIcon({
  icon,
  children,
  status,
  shadow,
  className,
  ...props
}: ChipButtonWithIconProps) {
  return (
    <button
      type="button"
      className={cn(chipButtonWithIconVariants({ status, shadow }), className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
