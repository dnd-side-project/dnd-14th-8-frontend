import { Chip } from "@moyeorak/design-system";
import { NearbyPlaceCard } from "@/domains/location/components/nearby-place-card";
import {
  NEARBY_CATEGORIES,
  type NearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
import { attachRevealFocusedChip } from "@/shared/utils/reveal-in-scroller";

export interface NearbyPlacesPanelProps {
  category: NearbyCategory;
  onCategoryChange: (category: NearbyCategory) => void;
  /** 고른 분류의 장소. 찾는 중이거나 찾지 못했으면 빈 배열을 넘긴다. */
  places: NearbyPlace[];
  /** 거리를 잰 역의 이름. "역"은 부르는 쪽에서 `formatStationName`으로 붙인다. */
  stationName: string;
  onPlaceClick: (place: NearbyPlace) => void;
}

/**
 * 결과 화면의 주변 살펴보기 탭 내용(#269). 분류 칩 줄과 고른 분류의 장소 카드다.
 * 칩은 아이콘 없이 NEARBY_CATEGORIES 순서로 늘 모두 보인다. 장소가 없으면 카드 자리를 비운다.
 * 카드마다 `data-place-id`(카카오 장소 ID)를 단다. 고른 장소를 닫으면 결과 화면이 이 값으로 그 카드에 포커스를 돌려준다(#271).
 */
export function NearbyPlacesPanel({
  category,
  onCategoryChange,
  places,
  stationName,
  onPlaceClick,
}: NearbyPlacesPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* SEED 안전 영역 패턴(스크롤되는 콘텐츠)처럼 칩 줄을 화면 끝까지 잇는다. 첫 칩은 다른 콘텐츠와 같은 20px에서 시작하고, 끝까지 넘기면 마지막 칩 뒤에 20px가 남는다. 좌우 20px는 포커스 링(두께 2px, 간격 2px) 자리도 맡고, 위아래는 4px를 두고 margin으로 되돌린다. */}
      <div
        className="scrollbar-hide -mx-5 -my-1 flex gap-2 overflow-x-auto px-5 py-1"
        ref={attachRevealFocusedChip}
      >
        {NEARBY_CATEGORIES.map((item) => {
          const selected = item === category;

          return (
            <Chip
              key={item}
              shape="pill"
              pressed={selected}
              variant={selected ? "brand" : "neutral-weak"}
              className="shrink-0"
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </Chip>
          );
        })}
      </div>

      {places.length > 0 && (
        <div className="flex flex-col gap-2">
          {places.map((place) => (
            <NearbyPlaceCard
              key={place.id}
              data-place-id={place.id}
              name={place.name}
              address={place.address}
              stationName={stationName}
              distanceMeters={place.distanceMeters}
              onClick={() => onPlaceClick(place)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
