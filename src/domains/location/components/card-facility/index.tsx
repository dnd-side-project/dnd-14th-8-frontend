import { Icon } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { formatStationName } from "@/domains/location/utils/format";
import { LocationIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface CardFacilityProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  /** 검색 기준이 된 역 이름. 백엔드 역 이름처럼 "역"이 없어도 된다 */
  stationName: string;
  /** 역에서 장소까지 거리(m). 카카오가 준 값 그대로 쓴다 */
  distanceMeters: number;
}

/**
 * 장소 상세 화면의 장소 카드. 카카오 검색 결과에는 영업 정보가 없어 영업 상태 줄은 뺐다(#269).
 */
export function CardFacility({
  name,
  stationName,
  distanceMeters,
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
        <div className="flex items-center gap-0.5">
          <LocationIcon className="size-5 shrink-0" />
          <span className="textStyle_body5 text-fg-neutral-subtle">
            {formatStationName(stationName)}에서 {distanceMeters}m
          </span>
        </div>
      </div>
      <Icon type="chevron_right" size="md" variant="weak" />
    </button>
  );
}
