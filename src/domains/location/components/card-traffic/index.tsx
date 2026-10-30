import { Fragment, type HTMLAttributes } from "react";
import {
  formatDistance,
  formatDuration,
} from "@/domains/location/utils/format";
import { ArrowRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface CardTrafficProps extends HTMLAttributes<HTMLDivElement> {
  departure: string;
  arrival: string;
  distanceMeters?: number;
  durationMinutes: number;
  trafficGuides?: { label: string; value: string }[];
}

export function CardTraffic({
  departure,
  arrival,
  distanceMeters,
  durationMinutes,
  trafficGuides = [],
  className,
  ...props
}: CardTrafficProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-stroke-neutral-subtle bg-fill-neutral-faintest p-5",
        className,
      )}
      {...props}
    >
      {/* 상단: 출발지 → 도착지 + km */}
      <div className="mb-0.5 flex items-center justify-between">
        <div className="textStyle_body4 flex items-center gap-0.5 text-fg-neutral-default">
          <span className="truncate">{departure}</span>
          <ArrowRightIcon className="size-4 shrink-0 text-fg-neutral-subtler" />
          <span className="truncate">{arrival}</span>
        </div>
        {distanceMeters != null && (
          <span className="textStyle_body4 text-fg-brand-default">
            {formatDistance(distanceMeters)}
          </span>
        )}
      </div>

      {/* 메인: 소요 시간 */}
      <p className="textStyle_head3 mb-4 text-fg-neutral-stronger">
        {formatDuration(durationMinutes)}
      </p>

      <div className="grid grid-cols-[1fr_1px_1fr] items-stretch overflow-hidden rounded-md border border-stroke-neutral-subtler bg-fill-neutral-subtlest py-[14px]">
        {trafficGuides.map((guide, i) => (
          <Fragment key={guide.label}>
            {i !== 0 && (
              <div className="h-2.5 w-px self-center bg-stroke-neutral-subtle" />
            )}
            <div className="flex items-baseline justify-center gap-1">
              <span className="textStyle_body4 text-fg-neutral-subtle">
                {guide.label}
              </span>
              <span className="textStyle_body4 text-fg-neutral-default">
                {guide.value}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
