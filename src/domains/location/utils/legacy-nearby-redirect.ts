import { LOCATION_QUERY_PARAMS } from "@/domains/location/constants/location-query-params";
import { parseNearbyCategory } from "@/domains/location/constants/nearby-categories";
import { buildResultNearbyPath } from "@/domains/location/utils/nearby-paths";

/** 주소의 station_id를 역 번호로 읽는다. 양의 정수가 아니면 null이다. */
export function parseStationIdParam(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;

  const stationId = Number(value);
  return Number.isSafeInteger(stationId) && stationId > 0 ? stationId : null;
}

/**
 * 옛 주변 장소 목록 주소(/location/nearby/{좌표}?station_id=&category=)를
 * 결과 화면의 주변 살펴보기 탭 주소로 바꾼다(#269).
 * 역은 station_id로만 고르고 주소의 좌표는 쓰지 않는다. 역을 모르면 결과 화면이 1순위 역을 고른다.
 * 옛 분류 이름(스터디카페, 음식점)은 새 이름(스터디룸, 식당)으로 읽는다.
 */
export function buildLegacyNearbyRedirectPath({
  meetingId,
  searchParams,
}: {
  meetingId: string;
  searchParams: URLSearchParams;
}) {
  return buildResultNearbyPath({
    meetingId,
    stationId: parseStationIdParam(
      searchParams.get(LOCATION_QUERY_PARAMS.stationId),
    ),
    category: parseNearbyCategory(
      searchParams.get(LOCATION_QUERY_PARAMS.nearbyCategory),
    ),
  });
}
