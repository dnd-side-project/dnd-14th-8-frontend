import { Button } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { SearchIcon } from "@/shared/components/icons";
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
        <SearchIcon aria-hidden className="size-4 text-fg-brand-default" />
      }
      className={cn(
        "absolute top-4 right-4 z-30 h-10 gap-1.5 rounded-full shadow-[var(--shadows-strong)] focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
    >
      주변 장소
    </Button>
  );
}
