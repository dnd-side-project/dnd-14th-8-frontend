import { Button } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonBottomWithIconProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export function ButtonBottomWithIcon({
  children,
  className,
  icon,
  type = "button",
  ...props
}: ButtonBottomWithIconProps) {
  return (
    <Button
      {...props}
      type={type}
      variant="outline"
      size="md"
      display="full"
      className={cn(
        "gap-1.5 focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
      trailingIcon={
        <span
          aria-hidden
          className="inline-flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      }
    >
      {children}
    </Button>
  );
}
