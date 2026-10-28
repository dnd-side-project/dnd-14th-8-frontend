import { Chip } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ChipButtonWithIconProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  status?: "selected" | "unselected" | null;
  shadow?: "on" | "off" | null;
}

export function ChipButtonWithIcon({
  icon,
  children,
  status = "unselected",
  shadow = "off",
  className,
  type = "button",
  ...props
}: ChipButtonWithIconProps) {
  return (
    <Chip
      {...props}
      type={type}
      pressed={status === "selected"}
      variant={status === "selected" ? "brand" : "neutral-weak"}
      shape="pill"
      className={cn(
        "gap-1 focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        shadow === "on" && "shadow-[var(--shadows-strong)]",
        className,
      )}
    >
      <span aria-hidden className="inline-flex shrink-0">
        {icon}
      </span>
      {children}
    </Chip>
  );
}
