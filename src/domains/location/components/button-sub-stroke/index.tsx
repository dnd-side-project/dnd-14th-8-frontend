import { Button } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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
      className={className}
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
