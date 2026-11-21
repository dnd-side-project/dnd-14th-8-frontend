import { Navigate, useParams, useSearchParams } from "react-router";
import { buildLegacyPlaceDetailRedirectPath } from "@/domains/location/utils/legacy-nearby-redirect";

/**
 * 옛 장소 상세 주소. 장소 상세는 결과 화면 안의 장소 카드로 옮겼다(#271).
 * 이미 공유된 링크를 위해 주소는 남기고, 들어오면 고른 역, 분류, 장소를 유지한 채 결과 화면으로 넘긴다.
 * 주소의 좌표는 버린다. 장소가 고른 역의 검색 결과에 없으면 결과 화면이 목록으로 연다.
 */
export function PlaceDetailPage() {
  const { meetingId = "", placeId = "" } = useParams();
  const [searchParams] = useSearchParams();

  return (
    <Navigate
      to={buildLegacyPlaceDetailRedirectPath({
        meetingId,
        placeId,
        searchParams,
      })}
      replace
    />
  );
}
