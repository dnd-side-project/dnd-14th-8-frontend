import {
  LOCATION_QUERY_PARAMS,
  RESULT_TAB_VALUES,
} from "@/domains/location/constants/location-query-params";
import type { NearbyCategory } from "@/domains/location/constants/nearby-categories";

/**
 * 결과 화면의 주변 살펴보기 탭 주소. 옛 주변 장소 목록 주소(/location/nearby/{좌표})로 들어오면 여기로 넘긴다(#269).
 * 역을 모르면 station_id를 빼고, 결과 화면이 1순위 역을 고른다.
 * 장소를 넘기면 place_id를 붙여 그 장소를 고른 상태로 연다(#271). 옛 장소 상세 주소가 여기로 넘어온다.
 */
export function buildResultNearbyPath({
  meetingId,
  stationId,
  category,
  placeId,
}: {
  meetingId: string;
  stationId?: number | null;
  category: NearbyCategory;
  /** 카카오 장소 ID */
  placeId?: string | null;
}) {
  const search = new URLSearchParams();
  if (stationId != null && Number.isFinite(stationId)) {
    search.set(LOCATION_QUERY_PARAMS.stationId, String(stationId));
  }
  search.set(LOCATION_QUERY_PARAMS.resultTab, RESULT_TAB_VALUES.nearby);
  search.set(LOCATION_QUERY_PARAMS.nearbyCategory, category);
  if (placeId) {
    search.set(LOCATION_QUERY_PARAMS.placeId, placeId);
  }

  return `/meetings/${meetingId}/location/stations?${search.toString()}`;
}
