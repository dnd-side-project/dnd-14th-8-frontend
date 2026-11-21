import { Badge } from "@moyeorak/design-system";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface NearbyPlaceCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  name: string;
  address: string;
  /** 거리를 잰 역의 이름. "역"은 부르는 쪽에서 `formatStationName`으로 붙인다. */
  stationName: string;
  /** 역에서 장소까지의 거리(m). 카카오가 준 값을 그대로 쓴다. */
  distanceMeters: number;
}

/**
 * 주변 살펴보기 탭의 장소 카드(#269). 이름, 주소, 역에서의 거리를 보여 주고 누르면 장소 상세로 간다.
 * 영업 상태는 보여 주지 않는다. 이름과 주소는 한 줄로 두고 길면 말줄임한다.
 */
export function NearbyPlaceCard({
  name,
  address,
  stationName,
  distanceMeters,
  className,
  ...props
}: NearbyPlaceCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-pointer flex-col items-start rounded-lg border border-stroke-neutral-subtle bg-fill-neutral-faintest p-4 text-left transition-colors",
        // 디자인 시스템 focusRing과 같은 값이다(두께 2px, 간격 2px, 키보드로 옮겼을 때만).
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    >
      <span className="textStyle_title3 w-full truncate text-fg-neutral-strong">
        {name}
      </span>
      <span className="textStyle_body5 mt-1 w-full truncate text-fg-neutral-subtle">
        {address}
      </span>
      <Badge size="sm" variant="neutral-weak" className="mt-3">
        {`${stationName}에서 ${distanceMeters}m`}
      </Badge>
    </button>
  );
}
