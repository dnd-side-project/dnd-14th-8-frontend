import { Chip } from "@moyeorak/design-system";
import { NearbyPlaceCard } from "@/domains/location/components/nearby-place-card";
import {
  FOOD_CONDITION_LABEL,
  FOOD_CONDITIONS,
  type FoodCondition,
  NEARBY_CATEGORIES,
  type NearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import { UPDATING_CLASS } from "@/domains/location/constants/updating-class";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
import { SegmentedControl } from "@/shared/components/segmented-control";
import { cn } from "@/shared/utils/cn";
import { attachRevealFocusedChip } from "@/shared/utils/reveal-in-scroller";

const FOOD_CONDITION_OPTIONS = FOOD_CONDITIONS.map((condition) => ({
  value: condition,
  label: FOOD_CONDITION_LABEL[condition],
}));

export interface NearbyPlacesPanelProps {
  category: NearbyCategory;
  onCategoryChange: (category: NearbyCategory) => void;
  /** 식당의 조건(#273). 식당일 때만 조건 스위치를 보인다. */
  foodCondition: FoodCondition;
  onFoodConditionChange: (condition: FoodCondition) => void;
  /** 고른 분류의 장소. 찾는 중이거나 찾지 못했으면 빈 배열을 넘긴다. */
  places: NearbyPlace[];
  /**
   * true면 places는 분류나 조건을 바꿔 새 결과를 받는 동안 남겨 둔 이전 결과다(#275).
   * 카드를 0.2초 뒤 흐리게 하고(UPDATING_CLASS), 처음부터 누르거나 키보드로 옮겨 가지 못하게 한다.
   */
  updating?: boolean;
  /** 거리를 잰 역의 이름. "역"은 부르는 쪽에서 `formatStationName`으로 붙인다. */
  stationName: string;
  onPlaceClick: (place: NearbyPlace) => void;
}

/**
 * 결과 화면의 주변 살펴보기 탭 내용(#269). 분류 칩 줄과 고른 분류의 장소 카드다.
 * 칩은 아이콘 없이 NEARBY_CATEGORIES 순서로 늘 모두 보인다. 장소가 없으면 카드 자리를 비운다.
 * 카드마다 `data-place-id`(카카오 장소 ID)를 단다. 고른 장소를 닫으면 결과 화면이 이 값으로 그 카드에 포커스를 돌려준다(#271).
 * 식당을 고르면 분류 칩 아래에 조건 스위치(가까운 순, 맛집, 단체)가 나온다(#273).
 * 분류나 조건을 바꿔 새 결과를 받는 동안은 이전 카드를 흐리게 남긴다(updating, #275).
 */
export function NearbyPlacesPanel({
  category,
  onCategoryChange,
  foodCondition,
  onFoodConditionChange,
  places,
  updating = false,
  stationName,
  onPlaceClick,
}: NearbyPlacesPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 분류 칩 줄과 식당 조건 스위치는 8px 간격으로 한 덩어리로 두고, 카드와는 16px를 둔다(#273). */}
      <div className="flex flex-col gap-2">
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

        {/* 식당 조건(#273). 분류 칩과 같은 칩이면 같은 단계로 읽혀서, 글자 길이만큼의 작은 스위치(SegmentedControl)로 한 단계 낮게 둔다. 누르는 영역은 위아래 8px씩 늘어나므로 분류 칩 줄과 8px(gap-2) 넘게 떨어져 있어야 한다(스위치 안쪽 여백 2px까지 10px). */}
        {category === "식당" && (
          <SegmentedControl
            className="self-start"
            options={FOOD_CONDITION_OPTIONS}
            value={foodCondition}
            onChange={onFoodConditionChange}
          />
        )}
      </div>

      {places.length > 0 && (
        <div
          className={cn("flex flex-col gap-2", updating && UPDATING_CLASS)}
          aria-busy={updating}
          inert={updating}
        >
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
