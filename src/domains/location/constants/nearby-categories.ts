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

/** 예전 백엔드 분류 이름. 이미 공유된 링크의 category 값을 새 이름으로 읽는다. */
const LEGACY_NEARBY_CATEGORY: Record<string, NearbyCategory> = {
  스터디카페: "스터디룸",
  음식점: "식당",
};

function isNearbyCategory(value: string): value is NearbyCategory {
  return (NEARBY_CATEGORIES as readonly string[]).includes(value);
}

/** 주소의 category 값을 분류로 읽는다. 옛 이름은 새 이름으로, 모르는 값이나 빈 값은 첫 분류로. */
export function parseNearbyCategory(value: string | null): NearbyCategory {
  if (value && isNearbyCategory(value)) return value;
  if (value && value in LEGACY_NEARBY_CATEGORY) {
    return LEGACY_NEARBY_CATEGORY[value];
  }

  return NEARBY_CATEGORIES[0];
}

export interface NearbySearchRule {
  /** 키워드 검색어. 없으면 업종 검색이다. */
  keyword?: string;
  /** 카카오 업종 코드. 음식점 FD6, 카페 CE7 */
  categoryGroupCode?: "FD6" | "CE7";
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
