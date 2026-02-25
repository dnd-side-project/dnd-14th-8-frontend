import type { ButtonHTMLAttributes } from "react";
import {
  ChevronRightIcon,
  LocationIcon,
  TimeIcon,
} from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface CardFacilityProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  distanceFromBase: number;
  isOpen: boolean;
  businessStatusMessage: string;
}

export function CardFacility({
  name,
  distanceFromBase,
  isOpen,
  businessStatusMessage,
  className,
  ...props
}: CardFacilityProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-k-100 bg-k-5 p-4 text-left",
        "enabled:cursor-pointer disabled:cursor-default",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-4 truncate text-k-900 text-t2">{name}</p>
        <div className="mb-1 flex items-center gap-0.5">
          <LocationIcon className="size-5 shrink-0" />
          <span className="text-b5 text-k-600">
            추천장소에서 {distanceFromBase}m
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <TimeIcon className="size-5 shrink-0 text-k-500" />
          {isOpen ? (
            <span className="text-b5 text-primary-main">영업중</span>
          ) : (
            <span className="text-b5 text-k-600">영업종료</span>
          )}
          <span className="text-b5 text-k-200">·</span>
          <span className="text-b5 text-k-600">{businessStatusMessage}</span>
        </div>
      </div>
      <ChevronRightIcon className="-mr-1 size-10 shrink-0 text-k-400" />
    </button>
  );
}
