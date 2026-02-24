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
        "w-full rounded-xl border border-k-100 bg-k-5 p-5",
        className,
      )}
      {...props}
    >
      {/* 상단: 출발지 → 도착지 + km */}
      <div className="mb-0.5 flex items-center justify-between">
        <div className="flex items-center gap-0.5 text-b4 text-k-700">
          <span className="truncate">{departure}</span>
          <ArrowRightIcon className="size-4 shrink-0 text-k-400" />
          <span className="truncate">{arrival}</span>
        </div>
        {distanceMeters != null && (
          <span className="text-b4 text-primary-main">
            {formatDistance(distanceMeters)}
          </span>
        )}
      </div>

      {/* 메인: 소요 시간 */}
      <p className="mb-4 text-h2 text-k-900">
        {formatDuration(durationMinutes)}
      </p>

      <div className="grid grid-cols-[1fr_1px_1fr] items-stretch overflow-hidden rounded-md border border-k-50 bg-k-10 py-[14px]">
        {trafficGuides.map((guide, i) => (
          <Fragment key={guide.label}>
            {i !== 0 && <div className="h-2.5 w-px self-center bg-k-100" />}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-b4 text-k-500">{guide.label}</span>
              <span className="text-b4 text-k-700">{guide.value}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
