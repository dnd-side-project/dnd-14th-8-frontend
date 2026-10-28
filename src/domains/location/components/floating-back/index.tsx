import { FloatingButton } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface FloatingBackProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {}

export function FloatingBack({
  className,
  "aria-label": label = "뒤로 이동",
  ...props
}: FloatingBackProps) {
  return (
    <FloatingButton
      {...props}
      type="back"
      aria-label={label}
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
    />
  );
}
