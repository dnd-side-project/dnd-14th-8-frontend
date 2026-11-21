import { Badge, Icon, IconButton } from "@moyeorak/design-system";
import type { Ref } from "react";
import { cn } from "@/shared/utils/cn";

export interface SelectedPlaceCardProps {
  name: string;
  address: string;
  /** 거리를 잰 역의 이름. "역"은 부르는 쪽에서 `formatStationName`으로 붙인다. */
  stationName: string;
  /** 역에서 장소까지의 거리(m). 카카오가 준 값을 그대로 쓴다. */
  distanceMeters: number;
  onClose: () => void;
  /** 장소 이름(제목). 장소를 고르면 부르는 쪽이 여기로 포커스를 옮긴다. */
  titleRef?: Ref<HTMLHeadingElement>;
  className?: string;
}

/**
 * 결과 화면 주변 살펴보기에서 고른 장소의 카드(#271). 목록의 장소 카드(NearbyPlaceCard)와 같은 글자와
 * 배지에 닫기 버튼만 더했다. 시트에 이 카드 하나만 있어 목록 카드의 테두리와 바탕은 두지 않는다.
 */
export function SelectedPlaceCard({
  name,
  address,
  stationName,
  distanceMeters,
  onClose,
  titleRef,
  className,
}: SelectedPlaceCardProps) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <div className="flex w-full items-start gap-2">
        {/* 이름과 주소는 왼쪽 칸, 닫기는 오른쪽 칸이다. 긴 주소가 닫기 아래로 들어가지 않는다. 이름은 닫기 버튼(36px)과 가운데가 맞게 7px 내린다. */}
        <div className="min-w-0 flex-1 pt-[7px]">
          {/* 장소를 고르면 시트 내용이 통째로 바뀌어 포커스가 사라지므로 제목으로 옮긴다. 누를 수 있는 것이 아니라 포커스 테두리는 그리지 않는다. */}
          <h2
            ref={titleRef}
            tabIndex={-1}
            className="textStyle_title3 truncate text-fg-neutral-strong outline-none"
          >
            {name}
          </h2>
          <p className="textStyle_body5 mt-1 truncate text-fg-neutral-subtle">
            {address}
          </p>
        </div>
        {/* 공유 시트, 설치 안내의 닫기와 같은 조합이다. */}
        <IconButton
          aria-label="닫기"
          size="sm"
          variant="clear"
          className="shrink-0"
          onClick={onClose}
        >
          <Icon type="x_circle" size="md" />
        </IconButton>
      </div>
      <Badge size="sm" variant="neutral-weak" className="mt-3">
        {`${stationName}에서 ${distanceMeters}m`}
      </Badge>
    </div>
  );
}
