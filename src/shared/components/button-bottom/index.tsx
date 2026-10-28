import { Button, type ButtonProps } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonBottomProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "black" | "blue" | "white" | null;
}

const variants = {
  black: "default",
  blue: "brand",
  white: "outline",
} satisfies Record<string, ButtonProps["variant"]>;

/** 기존 화면의 API를 유지하며 배포된 디자인 시스템으로 전환한다. */
export function ButtonBottom({
  className,
  type = "button",
  variant = "black",
  ...props
}: ButtonBottomProps) {
  return (
    <Button
      {...props}
      type={type}
      variant={variants[variant ?? "black"]}
      size="xl"
      display="full"
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
    />
  );
}
