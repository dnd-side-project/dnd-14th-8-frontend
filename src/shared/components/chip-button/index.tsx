import { Button, Chip } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface ChipButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "primary"
    | "outlined"
    | "selected"
    | "ghost"
    | "floating"
    | "floatingSelected"
    | "midpoint"
    | "midpointSelected"
    | "locationDelete";
}

const focus =
  "shrink-0 focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2";

export function ChipButton({
  className,
  size = "sm",
  type = "button",
  variant = "primary",
  ...props
}: ChipButtonProps) {
  // 액션에 Toggle을 사용하면 aria-pressed가 잘못 생기므로 Button으로 구분한다.
  if (
    variant === "primary" ||
    variant === "ghost" ||
    variant === "locationDelete"
  ) {
    return (
      <Button
        {...props}
        type={type}
        variant={
          variant === "primary"
            ? "brand-weak"
            : variant === "ghost"
              ? "ghost-brand"
              : "ghost"
        }
        size={size === "xl" ? "md" : "sm"}
        className={cn(focus, className)}
      />
    );
  }
  const selected =
    variant === "selected" ||
    variant === "floatingSelected" ||
    variant === "midpointSelected";
  const floating = variant === "floating" || variant === "floatingSelected";
  const square = variant === "selected" || variant === "outlined";
  return (
    <Chip
      {...props}
      type={type}
      pressed={selected}
      shape={square ? "square" : "pill"}
      variant={
        selected
          ? square
            ? "outlined-brand"
            : floating
              ? "neutral"
              : "brand"
          : "neutral-weak"
      }
      className={cn(
        focus,
        floating && "shadow-[var(--shadows-strong)]",
        className,
      )}
    />
  );
}
