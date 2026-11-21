import { Navigate, useParams, useSearchParams } from "react-router";
import { buildLegacyNearbyRedirectPath } from "@/domains/location/utils/legacy-nearby-redirect";

/**
 * 옛 주변 장소 목록 주소. 목록은 결과 화면의 주변 살펴보기 탭으로 옮겼다(#269).
 * 이미 공유된 링크를 위해 주소는 남기고, 들어오면 고른 역과 분류를 유지한 채 탭으로 넘긴다.
 */
export function NearbySearchPage() {
  const { meetingId = "" } = useParams();
  const [searchParams] = useSearchParams();

  return (
    <Navigate
      to={buildLegacyNearbyRedirectPath({ meetingId, searchParams })}
      replace
    />
  );
}
