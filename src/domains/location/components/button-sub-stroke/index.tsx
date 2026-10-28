import { Button } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonSubStrokeProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export function ButtonSubStroke({
  children,
  className,
  icon,
  type = "button",
  ...props
}: ButtonSubStrokeProps) {
  return (
    <Button
      {...props}
      type={type}
      variant="outline"
      size="lg"
      display="full"
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
      leadingIcon={
        icon && (
          <span
            aria-hidden
            className="inline-flex shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        )
      }
    >
      {children}
    </Button>
  );
}
