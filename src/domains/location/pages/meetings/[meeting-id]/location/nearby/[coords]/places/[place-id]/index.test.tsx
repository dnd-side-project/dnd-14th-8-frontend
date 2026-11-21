import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Outlet, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import type { NearbyCategory } from "@/domains/location/constants/nearby-categories";
import { getMidpointRecommendationsQueryKey } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { getNearbyPlacesQueryKey } from "@/domains/location/hooks/use-nearby-places";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import { PlaceDetailPage } from "@/domains/location/pages/meetings/[meeting-id]/location/nearby/[coords]/places/[place-id]";
import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";

const STATION = { latitude: 37.5663, longitude: 126.9918 };

function station(
  over: Partial<StationRecommendationDto>,
): StationRecommendationDto {
  return {
    avgTransitDuration: 25,
    distanceFromCenter: 300,
    lines: ["2호선"],
    rank: 1,
    routes: [],
    stationId: 101,
    stationName: "을지로3가",
    ...STATION,
    ...over,
  };
}

// 카카오 장소 ID는 문자열이다. 이름과 주소는 지어낸 것이다.
const PLACES: NearbyPlace[] = [
  {
    id: "9000",
    name: "모여 스터디룸",
    address: "서울 중구 을지로 100",
    distanceMeters: 120,
    latitude: 37.5671,
    longitude: 126.9912,
    placeUrl: "https://place.map.kakao.com/9000",
  },
  {
    id: "9001",
    name: "을지 스터디카페",
    address: "서울 중구 을지로 101",
    distanceMeters: 260,
    latitude: 37.5648,
    longitude: 126.993,
    placeUrl: "https://place.map.kakao.com/9001",
  },
];

const OUTLET_CONTEXT: MapPageOutletContext = {
  mapInst: null,
  sheetHeight: 0,
  setSheetHeight: () => undefined,
  setMapBlurred: () => undefined,
};

/**
 * 장소 상세를 서버 렌더링으로 그린다. 효과가 돌지 않아 카카오를 부르지 않으므로,
 * 검색 결과는 같은 키로 미리 넣어 둔다. 넣지 않으면 검색 중인 상태다.
 */
const SEOUL_STATION = {
  stationId: 105,
  stationName: "서울역",
  latitude: 37.5547,
  longitude: 126.9707,
};

function renderPlaceDetail({
  path,
  places,
  category = "스터디룸",
  recommendations = [station({}), station({ ...SEOUL_STATION, rank: 2 })],
}: {
  path: string;
  places?: NearbyPlace[];
  category?: NearbyCategory;
  recommendations?: StationRecommendationDto[];
}) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(
    getMidpointRecommendationsQueryKey({ meetingId: "m1" }),
    { centerPoint: STATION, recommendations },
  );
  if (places) {
    queryClient.setQueryData(
      getNearbyPlacesQueryKey({ ...STATION, category }),
      places,
    );
  }

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/meetings/:meetingId/location"
            element={<Outlet context={OUTLET_CONTEXT} />}
          >
            <Route
              path="nearby/:coords/places/:placeId"
              element={<PlaceDetailPage />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function detailPath(placeId: string, query: string) {
  return `/meetings/m1/location/nearby/37.5663x126.9918/places/${placeId}?${query}`;
}

describe("PlaceDetailPage", () => {
  it("카카오 장소 ID로 장소를 찾아 이름과 역에서 거리를 보여 준다", () => {
    const markup = renderPlaceDetail({
      path: detailPath(
        "9001",
        `station_id=101&category=${encodeURIComponent("스터디룸")}`,
      ),
      places: PLACES,
    });

    expect(markup).toContain("을지 스터디카페");
    expect(markup).toContain("을지로3가역에서 260m");
    expect(markup).toContain("자세히 보기");
    expect(markup).not.toContain("모여 스터디룸");
    expect(markup).not.toContain("찾을 수 없어요");
  });

  it("옛 분류 이름(스터디카페)도 새 분류(스터디룸)의 검색 결과에서 찾는다", () => {
    const markup = renderPlaceDetail({
      path: detailPath(
        "9000",
        `station_id=101&category=${encodeURIComponent("스터디카페")}`,
      ),
      places: PLACES,
      category: "스터디룸",
    });

    expect(markup).toContain("을지로3가역에서 120m");
  });

  it("추천역이 없어도 찾은 장소는 이름과 자세히 보기를 보여 주고, 거리 줄은 숨긴다", () => {
    const markup = renderPlaceDetail({
      path: detailPath(
        "9001",
        `station_id=101&category=${encodeURIComponent("스터디룸")}`,
      ),
      places: PLACES,
      recommendations: [],
    });

    expect(markup).toContain("을지 스터디카페");
    expect(markup).toContain("자세히 보기");
    expect(markup).not.toContain("260m");
    expect(markup).not.toContain("찾을 수 없어요");
  });

  it("주소 좌표의 역이 추천에서 빠지면 다른 역 이름으로 거리를 보여 주지 않는다", () => {
    // 을지로3가역 좌표로 만든 링크인데, 지금 추천에는 서울역만 남았다.
    const markup = renderPlaceDetail({
      path: detailPath(
        "9001",
        `station_id=101&category=${encodeURIComponent("스터디룸")}`,
      ),
      places: PLACES,
      recommendations: [station({ ...SEOUL_STATION, rank: 1 })],
    });

    expect(markup).toContain("을지 스터디카페");
    expect(markup).toContain("자세히 보기");
    expect(markup).not.toContain("서울역에서");
    expect(markup).not.toContain("260m");
  });

  it("옛 백엔드 번호처럼 검색 결과에 없는 번호면 찾지 못했다고 알린다", () => {
    const markup = renderPlaceDetail({
      path: detailPath(
        "1",
        `station_id=101&category=${encodeURIComponent("스터디룸")}`,
      ),
      places: PLACES,
    });

    expect(markup).toContain("요청한 장소 정보를 찾을 수 없어요");
    expect(markup).toContain("주변 살펴보기로");
    expect(markup).not.toContain("자세히 보기");
  });

  it("검색 중에는 장소도, 찾지 못했다는 문구도 보여 주지 않는다", () => {
    const markup = renderPlaceDetail({
      path: detailPath(
        "9000",
        `station_id=101&category=${encodeURIComponent("스터디룸")}`,
      ),
    });

    expect(markup).not.toContain("자세히 보기");
    expect(markup).not.toContain("찾을 수 없어요");
  });

  it("주소의 좌표를 읽지 못하면 찾지 못했다고 알린다", () => {
    const markup = renderPlaceDetail({
      path: `/meetings/m1/location/nearby/not-coords/places/9000?station_id=101`,
      places: PLACES,
    });

    expect(markup).toContain("요청한 장소 정보를 찾을 수 없어요");
  });
});
