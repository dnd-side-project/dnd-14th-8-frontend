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
    <button
      aria-label="선택한 역 주변 장소 둘러보기"
      className={cn(
        "absolute top-4 right-4 z-30 inline-flex h-10 items-center justify-center gap-1.5 rounded-full",
        "border border-primary-main/20 bg-k-5 px-3.5 text-b4 text-k-800 shadow-[0_2px_10px_rgba(0,0,0,0.18)]",
        "transition-colors enabled:cursor-pointer enabled:active:bg-k-50 enabled:hover:bg-white",
        "focus-visible:outline-2 focus-visible:outline-primary-main focus-visible:outline-offset-2",
        className,
      )}
      type={type}
      {...props}
    >
      <SearchIcon aria-hidden className="size-4 text-primary-main" />
      <span>주변 장소</span>
    </button>
  );
}
