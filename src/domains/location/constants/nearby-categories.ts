import type { FacilityType } from "@/domains/location/components/facility-pin";

/**
 * 주변 살펴보기의 분류. 칩도 이 순서로 보인다(#269).
 * 이름과 검색어는 프론트의 검색 규칙이 정한다. 예전에는 백엔드가 정했다.
 */
export const NEARBY_CATEGORIES = [
  "스터디룸",
  "회의실",
  "식당",
  "카페",
] as const;

export type NearbyCategory = (typeof NEARBY_CATEGORIES)[number];

/**
 * 예전 백엔드 분류 이름. 이미 공유된 링크의 category 값을 새 이름으로 읽는다.
 * 객체로 두고 `in`으로 찾으면 `toString` 같은 상속 속성까지 걸려서 Map으로 둔다.
 */
const LEGACY_NEARBY_CATEGORY = new Map<string, NearbyCategory>([
  ["스터디카페", "스터디룸"],
  ["음식점", "식당"],
]);

function isNearbyCategory(value: string): value is NearbyCategory {
  return (NEARBY_CATEGORIES as readonly string[]).includes(value);
}

/** 주소의 category 값을 분류로 읽는다. 옛 이름은 새 이름으로, 모르는 값이나 빈 값은 첫 분류로. */
export function parseNearbyCategory(value: string | null): NearbyCategory {
  if (value && isNearbyCategory(value)) return value;

  return (value && LEGACY_NEARBY_CATEGORY.get(value)) || NEARBY_CATEGORIES[0];
}

export interface NearbySearchRule {
  /** 키워드 검색어. 없으면 업종 검색이다. */
  keyword?: string;
  /** 카카오 업종 코드. 음식점 FD6, 카페 CE7. 키워드와 함께 주면 그 업종 안에서 키워드로 찾는다 */
  categoryGroupCode?: "FD6" | "CE7";
  /** 가까운 순 또는 카카오 정확도순(무엇으로 매기는지는 카카오 문서에 없다) */
  sort: "distance" | "accuracy";
}

/**
 * 분류마다 카카오에 보내는 검색(#269 "검색 규칙"). 추천역 12곳에서 검증했다(2026-11-20).
 * 예전 검색어 "분위기좋은식당", "분위기좋은카페"는 카카오 키워드 검색에서 거의 걸리지 않았다.
 */
export const NEARBY_SEARCH_RULES: Record<NearbyCategory, NearbySearchRule> = {
  스터디룸: { keyword: "스터디룸", sort: "distance" },
  회의실: { keyword: "회의실", sort: "distance" },
  식당: { categoryGroupCode: "FD6", sort: "distance" },
  카페: { categoryGroupCode: "CE7", sort: "distance" },
};

/**
 * 식당의 조건(#273). 칩도 이 순서로 보이고, 주소 쿼리(condition)에는 이 값을 쓴다. 다른 분류에는 조건이 없다.
 * 처음에는 늘 가까운 순이다.
 */
export const FOOD_CONDITIONS = ["nearest", "popular", "group"] as const;

export type FoodCondition = (typeof FOOD_CONDITIONS)[number];

/** 조건 스위치의 칸 이름. 맛집은 별점이 아니라 카카오 정확도순이라 별점처럼 보이는 말은 쓰지 않는다. */
export const FOOD_CONDITION_LABEL: Record<FoodCondition, string> = {
  nearest: "가까운 순",
  popular: "맛집",
  group: "단체",
};

/** 주소의 condition 값을 식당 조건으로 읽는다. 모르는 값이나 빈 값은 가까운 순. */
export function parseFoodCondition(value: string | null): FoodCondition {
  return value && (FOOD_CONDITIONS as readonly string[]).includes(value)
    ? (value as FoodCondition)
    : "nearest";
}

/**
 * 식당 조건마다 카카오에 보내는 검색(#273 "검색 규칙"). 가까운 순은 #269의 식당 규칙 그대로다.
 * 맛집과 단체는 음식점 업종 안에서 키워드로 찾고 정확도순이다. 단체 검색어는 "회식"과 결과가 많이 겹쳐
 * "단체모임" 하나로 정했다(추천역 12곳 확인, 2026-11-20).
 */
export const FOOD_SEARCH_RULES: Record<FoodCondition, NearbySearchRule> = {
  nearest: NEARBY_SEARCH_RULES.식당,
  popular: { keyword: "맛집", categoryGroupCode: "FD6", sort: "accuracy" },
  group: { keyword: "단체모임", categoryGroupCode: "FD6", sort: "accuracy" },
};

/** 분류와 식당 조건으로 검색 규칙을 고른다. 식당이 아니면 조건은 쓰지 않는다. */
export function getNearbySearchRule(
  category: NearbyCategory,
  foodCondition: FoodCondition = "nearest",
): NearbySearchRule {
  return category === "식당"
    ? FOOD_SEARCH_RULES[foodCondition]
    : NEARBY_SEARCH_RULES[category];
}

/** 역 좌표에서 찾는 반경(m)과 받는 개수 */
export const NEARBY_SEARCH_RADIUS_METERS = 1000;
export const NEARBY_SEARCH_SIZE = 15;

/**
 * 지도 장소 핀의 아이콘. 분류 이름이 정확히 같을 때만 고른다.
 * 예전에는 이름 일부("카페", "식당")로 골라서 "스터디카페"는 컵, "음식점"은 책이 붙었다.
 */
export const NEARBY_FACILITY_TYPE: Record<NearbyCategory, FacilityType> = {
  스터디룸: "book",
  회의실: "meetingroom",
  식당: "restaurant",
  카페: "cafe",
};
