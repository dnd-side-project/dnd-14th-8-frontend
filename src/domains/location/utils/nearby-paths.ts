import {
  LOCATION_QUERY_PARAMS,
  RESULT_TAB_VALUES,
} from "@/domains/location/constants/location-query-params";
import type { NearbyCategory } from "@/domains/location/constants/nearby-categories";
import { toCoordsPath } from "@/domains/location/utils/coords";

/**
 * 결과 화면의 주변 살펴보기 탭 주소. 옛 주변 장소 목록 주소(/location/nearby/{좌표})로 들어오면 여기로 넘긴다(#269).
 * 역을 모르면 station_id를 빼고, 결과 화면이 1순위 역을 고른다.
 */
export function buildResultNearbyPath({
  meetingId,
  stationId,
  category,
}: {
  meetingId: string;
  stationId?: number | null;
  category: NearbyCategory;
}) {
  const search = new URLSearchParams();
  if (stationId != null && Number.isFinite(stationId)) {
    search.set(LOCATION_QUERY_PARAMS.stationId, String(stationId));
  }
  search.set(LOCATION_QUERY_PARAMS.resultTab, RESULT_TAB_VALUES.nearby);
  search.set(LOCATION_QUERY_PARAMS.nearbyCategory, category);

  return `/meetings/${meetingId}/location/stations?${search.toString()}`;
}

/** 장소 상세 주소. 장소 번호는 카카오 장소 ID이고, 좌표는 검색 기준이 되는 역 좌표다. */
export function buildPlaceDetailPath({
  meetingId,
  latitude,
  longitude,
  placeId,
  stationId,
  category,
}: {
  meetingId: string;
  latitude: number;
  longitude: number;
  placeId: string;
  stationId: number;
  category: NearbyCategory;
}) {
  const search = new URLSearchParams({
    [LOCATION_QUERY_PARAMS.stationId]: String(stationId),
    [LOCATION_QUERY_PARAMS.nearbyCategory]: category,
  });

  return `/meetings/${meetingId}/location/nearby/${toCoordsPath({ latitude, longitude })}/places/${encodeURIComponent(placeId)}?${search.toString()}`;
}
