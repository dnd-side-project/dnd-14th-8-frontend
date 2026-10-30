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
  isOpen: boolean | null;
  businessStatusMessage: string | null;
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
        "flex w-full items-center gap-3 rounded-lg border border-stroke-neutral-subtle bg-fill-neutral-faintest p-4 text-left",
        "enabled:cursor-pointer disabled:cursor-default",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="textStyle_title3 mb-4 truncate text-fg-neutral-stronger">
          {name}
        </p>
        <div className="mb-1 flex items-center gap-0.5">
          <LocationIcon className="size-5 shrink-0" />
          <span className="textStyle_body5 text-fg-neutral-subtle">
            추천장소에서 {distanceFromBase}m
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <TimeIcon className="size-5 shrink-0 text-fg-neutral-subtle" />
          {isOpen == null ? (
            <span className="textStyle_body5 text-fg-neutral-subtle">
              영업정보 없음
            </span>
          ) : isOpen ? (
            <span className="textStyle_body5 text-fg-brand-default">
              영업중
            </span>
          ) : (
            <span className="textStyle_body5 text-fg-neutral-subtle">
              영업종료
            </span>
          )}
          {businessStatusMessage && (
            <>
              <span className="textStyle_body5 text-fg-neutral-subtlest">
                ·
              </span>
              <span className="textStyle_body5 text-fg-neutral-subtle">
                {businessStatusMessage}
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronRightIcon className="-mr-1 size-10 shrink-0 text-fg-neutral-subtler" />
    </button>
  );
}
