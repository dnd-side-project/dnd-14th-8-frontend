import { Button, Icon } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type NearbyPlacesFloatingButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement>;

export function NearbyPlacesFloatingButton({
  className,
  type = "button",
  ...props
}: NearbyPlacesFloatingButtonProps) {
  return (
    <Button
      aria-label="선택한 역 주변 장소 둘러보기"
      {...props}
      type={type}
      variant="outline"
      size="sm"
      leadingIcon={
        <span aria-hidden className="inline-flex shrink-0">
          <Icon type="search" size="xs" variant="brand" />
        </span>
      }
      className={cn(
        "absolute top-4 right-4 z-30 h-10 gap-1.5 rounded-full shadow-[var(--shadows-strong)]",
        className,
      )}
    >
      주변 장소
    </Button>
  );
}
