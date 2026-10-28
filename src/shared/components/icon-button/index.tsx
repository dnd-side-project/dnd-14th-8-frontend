import { IconButton as DesignSystemIconButton } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";
import { cn } from "@/shared/utils/cn";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  background?: "none" | "circle" | "square";
  /** @deprecated 배경 크기는 디자인 시스템 버튼 크기와 함께 정해진다. */
  backgroundSize?: "xs" | "sm" | "md" | "lg";
  iconSize: "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "primary"
    | "surface"
    | "dark"
    | "gray"
    | "neutral"
    | "subtle"
    | "ghost";
  iconClassName?: string;
  "aria-label": string;
}

// 기존 달력과 하단 액션 바의 배치 크기는 전환 기간 동안 보존한다.
const sizes = {
  xs: "size-5",
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
  xl: "size-12",
  "2xl": "size-[54px]",
};
const iconSizes = {
  xs: "size-[15px]",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-9",
};

export function IconButton({
  type = "button",
  size,
  variant,
  background = "none",
  backgroundSize: _backgroundSize,
  icon: Icon,
  iconSize,
  iconClassName,
  className,
  ...props
}: IconButtonProps) {
  const filled =
    background !== "none" &&
    (variant === undefined || variant === "primary" || variant === "dark");
  return (
    <DesignSystemIconButton
      {...props}
      type={type}
      variant={filled ? "fill" : "clear"}
      size={size === "2xl" ? "lg" : "md"}
      className={cn(
        sizes[size],
        background === "circle" && "rounded-full",
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn("shrink-0", iconSizes[iconSize], iconClassName)}
      />
    </DesignSystemIconButton>
  );
}
