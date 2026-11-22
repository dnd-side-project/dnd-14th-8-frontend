// @vitest-environment jsdom
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { type ReactNode, useState } from "react";
import {
  MemoryRouter,
  type NavigateFunction,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDeparturesQueryKey } from "@/domains/location/hooks/use-get-departures";
import { getMidpointRecommendationsQueryKey } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import { LocationMainPage } from "@/domains/location/pages/meetings/[meeting-id]/location/stations";
import type {
  LocationVote,
  StationRecommendationDto,
} from "@/domains/location/types/location-api-types";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
import {
  getFitAnchorY,
  getMapFitPadding,
} from "@/domains/location/utils/map-viewport";
import { searchNearbyPlaces } from "@/domains/location/utils/search-nearby-places";
import { getMyParticipantQueryKey } from "@/domains/schedule/hooks/use-get-my-participant";
import { toast } from "@/shared/components/toast";
import { ShareSheetContext } from "@/shared/providers/share-sheet-provider";
import { getGuestId } from "@/shared/utils/auth";

vi.mock("@/domains/location/utils/search-nearby-places", () => ({
  searchNearbyPlaces: vi.fn(),
}));

// 지도 SDK 없이 핀을 문서에 그린다. 누를 수 있는 핀은 버튼이고, 쌓는 순서는 data-z로 남긴다.
vi.mock("@/domains/location/components/map-marker", () => ({
  MapMarker: ({
    children,
    onClick,
    zIndex,
  }: {
    children: ReactNode;
    onClick?: () => void;
    zIndex?: number;
  }) =>
    onClick ? (
      <button
        type="button"
        data-testid="map-pin"
        data-z={zIndex}
        onClick={onClick}
      >
        {children}
      </button>
    ) : (
      <div data-testid="map-marker" data-z={zIndex}>
        {children}
      </div>
    ),
}));

// jsdom에는 ResizeObserver가 없다(아래 버튼 영역 FixedBottomArea가 쓴다).
vi.stubGlobal(
  "ResizeObserver",
  class {
    disconnect() {}
    observe() {}
    unobserve() {}
  },
);

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

const DEPARTURES: LocationVote[] = [
  {
    locationVoteId: 11,
    participantName: "락이",
    departureLocation: "강남역 2호선",
    departureLat: 37.4979,
    departureLng: 127.0276,
  },
  {
    locationVoteId: 12,
    participantName: "모락",
    departureLocation: "합정역 2호선",
    departureLat: 37.5495,
    departureLng: 126.9139,
  },
];

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

const LIST_PATH = `/meetings/m1/location/stations?station_id=101&tab=nearby&category=${encodeURIComponent("스터디룸")}`;

/** 테스트에서 뒤로 가기, 앞으로 가기를 하려고 LocationProbe가 담아 두는 navigate. */
let historyNavigate: NavigateFunction | null = null;

/** 지금 주소, 넘어온 방식(PUSH, REPLACE, POP), 기록에 붙은 표시를 글자로 보여 준다. */
function LocationProbe() {
  const location = useLocation();
  const navigationType = useNavigationType();
  historyNavigate = useNavigate();
  return (
    <>
      <p data-testid="location">{location.pathname + location.search}</p>
      <p data-testid="navigation-type">{navigationType}</p>
      <p data-testid="state">{JSON.stringify(location.state)}</p>
    </>
  );
}

/** MapDefaultPage처럼 시트 높이를 받아 결과 화면에 다시 넘긴다. */
function MapLayout({ mapInst }: { mapInst: naver.maps.Map | null }) {
  const [sheetHeight, setSheetHeight] = useState(0);
  const context: MapPageOutletContext = {
    mapInst,
    sheetHeight,
    setSheetHeight,
    setMapBlurred: () => undefined,
  };
  return (
    <>
      <Outlet context={context} />
      <LocationProbe />
      <p data-testid="sheet-height">{sheetHeight}</p>
    </>
  );
}

function renderResult({
  path,
  forwardPath,
  mapInst = null,
  prefillMidpoint = true,
}: {
  path: string;
  /** 있으면 기록에서 path 다음(앞으로 가기)에 둔다. */
  forwardPath?: string;
  mapInst?: naver.maps.Map | null;
  /** false면 추천 응답을 미리 넣지 않는다(첫 조회가 아직 끝나지 않은 상태). */
  prefillMidpoint?: boolean;
}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // 백엔드 응답은 미리 넣어 둔다(30초 동안 다시 부르지 않음). 주변 장소는 매번 searchNearbyPlaces를 부른다.
  queryClient.setQueryData(
    getDeparturesQueryKey({ meetingId: "m1" }),
    DEPARTURES,
  );
  if (prefillMidpoint)
    queryClient.setQueryData(
      getMidpointRecommendationsQueryKey({ meetingId: "m1" }),
      {
        centerPoint: STATION,
        registeredCount: 2,
        totalCount: 2,
        recommendations: [
          station({}),
          station({
            stationId: 105,
            stationName: "서울역",
            latitude: 37.5547,
            longitude: 126.9707,
            rank: 2,
          }),
        ],
      },
    );
  queryClient.setQueryData(
    getMyParticipantQueryKey({
      localStorageKey: getGuestId(),
      meetingId: "m1",
    }),
    { participantId: 1, name: "락이", locationVoteId: 11, isHost: true },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <ShareSheetContext.Provider value={{ share: () => undefined }}>
        <MemoryRouter
          initialEntries={forwardPath ? [path, forwardPath] : [path]}
          initialIndex={0}
        >
          <Routes>
            <Route
              path="/meetings/:meetingId/location"
              element={<MapLayout mapInst={mapInst} />}
            >
              <Route path="stations" element={<LocationMainPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ShareSheetContext.Provider>
    </QueryClientProvider>,
  );
}

function currentUrl() {
  return new URL(
    screen.getByTestId("location").textContent ?? "",
    "https://moyeorak.site",
  );
}

function navigationType() {
  return screen.getByTestId("navigation-type").textContent;
}

/** 시트 안 장소 카드(목록). data-place-id가 붙은 버튼이다. */
function listCard(placeId: string) {
  const card = document.querySelector<HTMLElement>(
    `button[data-place-id="${placeId}"]`,
  );
  if (!card) throw new Error(`목록 카드 없음: ${placeId}`);
  return card;
}

/** 고른 장소 핀(검은 이름표와 큰 핀). 쌓는 순서 130에 있다. */
function selectedPin() {
  return document.querySelector<HTMLElement>(
    '[data-testid="map-marker"][data-z="130"]',
  );
}

beforeEach(() => {
  vi.mocked(searchNearbyPlaces).mockResolvedValue(PLACES);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  delete (window as unknown as { naver?: unknown }).naver;
});

describe("결과 화면 주변 살펴보기에서 장소 고르기(#271)", () => {
  it("목록 카드를 누르면 결과 화면에 머문 채 place_id를 더하고 기록을 쌓는다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(listCard("9001"));

    const url = currentUrl();
    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("place_id")).toBe("9001");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("스터디룸");
    expect(navigationType()).toBe("PUSH");
  });

  it("고른 상태의 시트는 장소 카드 하나이고 아래 버튼은 자세히 보기 하나다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(listCard("9001"));

    const title = screen.getByRole("heading", { name: "을지 스터디카페" });
    expect(title).toBeTruthy();
    expect(screen.getByText("서울 중구 을지로 101")).toBeTruthy();
    expect(screen.getByText("을지로3가역에서 260m")).toBeTruthy();
    expect(screen.getByRole("button", { name: "닫기" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "자세히 보기" })).toBeTruthy();

    // 제목, 역 카드, 탭, 분류 칩, 다른 장소 카드, 공유, 출발지 버튼은 없다.
    expect(screen.queryByText(/가장 최적의/)).toBeNull();
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.queryByRole("button", { name: "스터디룸" })).toBeNull();
    expect(document.body.textContent).not.toContain("평균");
    expect(document.querySelector("button[data-place-id]")).toBeNull();
    expect(screen.queryByRole("button", { name: "공유하기" })).toBeNull();
    expect(screen.queryByText("출발지 관리하기")).toBeNull();
  });

  it("자세히 보기는 카카오맵 장소 페이지를 새 창으로 연다", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    renderResult({ path: `${LIST_PATH}&place_id=9000` });

    fireEvent.click(await screen.findByRole("button", { name: "자세히 보기" }));

    expect(open).toHaveBeenCalledWith(
      "https://place.map.kakao.com/9000",
      "_blank",
    );
    open.mockRestore();
  });

  it("지도의 장소 핀을 눌러도 고르고(push), 고른 상태에서 다른 핀을 누르면 기록을 쌓지 않고 바꾼다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");

    const pins = screen.getAllByTestId("map-pin");
    expect(pins).toHaveLength(2);
    fireEvent.click(pins[0]);
    expect(currentUrl().searchParams.get("place_id")).toBe("9000");
    expect(navigationType()).toBe("PUSH");

    // 고른 장소는 누를 수 없는 큰 핀이 되고, 남은 핀은 하나다.
    const [otherPin] = screen.getAllByTestId("map-pin");
    fireEvent.click(otherPin);
    expect(currentUrl().searchParams.get("place_id")).toBe("9001");
    expect(navigationType()).toBe("REPLACE");
    // 앱 안에서 골랐다는 표시는 바꿔도 남아 닫기가 뒤로 가기로 동작한다.
    expect(screen.getByTestId("state").textContent).toContain(
      "placePickedInApp",
    );
    expect(
      screen.getByRole("heading", { name: "을지 스터디카페" }),
    ).toBeTruthy();
  });

  it("고른 장소는 검은 이름표와 큰 핀으로 다른 장소 핀(110)과 역 이름표(120) 위(130)에 그린다", async () => {
    renderResult({ path: `${LIST_PATH}&place_id=9001` });
    await screen.findByRole("heading", { name: "을지 스터디카페" });

    const pin = selectedPin();
    expect(pin).not.toBeNull();
    expect(
      within(pin as HTMLElement).getByText("을지 스터디카페"),
    ).toBeTruthy();
    // 검은 이름표(TextPin black)다. 역 이름표는 파란색이다.
    expect(pin?.innerHTML).toContain("bg-fill-neutral-default");
    expect(pin?.innerHTML).not.toContain("bg-fill-brand-default");
    // 다른 장소 핀은 그대로 누를 수 있게 남는다.
    const others = screen.getAllByTestId("map-pin");
    expect(others).toHaveLength(1);
    expect(others[0].dataset.z).toBe("110");
  });

  it("앱 안에서 고른 뒤 닫기를 누르면 뒤로 가기처럼 목록 기록으로 돌아간다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");
    fireEvent.click(listCard("9001"));

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(navigationType()).toBe("POP");
    expect(currentUrl().searchParams.has("place_id")).toBe(false);
    expect(screen.getByText(/가장 최적의/)).toBeTruthy();
    expect(screen.getByRole("tab", { name: "주변 살펴보기" })).toBeTruthy();
  });

  it("링크로 바로 연 고른 상태에서 닫기를 누르면 place_id만 지운다(replace)", async () => {
    renderResult({ path: `${LIST_PATH}&place_id=9001` });
    await screen.findByRole("heading", { name: "을지 스터디카페" });

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    const url = currentUrl();
    expect(navigationType()).toBe("REPLACE");
    expect(url.searchParams.has("place_id")).toBe(false);
    expect(url.searchParams.get("station_id")).toBe("101");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("스터디룸");
    expect(listCard("9001")).toBeTruthy();
  });

  it("주소의 장소가 검색 결과에 없으면 토스트로 알리고 목록으로 열며 place_id를 replace로 지운다", async () => {
    const toastMessage = vi.spyOn(toast, "message");
    renderResult({ path: `${LIST_PATH}&place_id=1` });

    await screen.findByText("을지 스터디카페");

    expect(navigationType()).toBe("REPLACE");
    expect(currentUrl().searchParams.has("place_id")).toBe(false);
    expect(screen.queryByRole("button", { name: "닫기" })).toBeNull();
    expect(screen.getByText("출발지 관리하기")).toBeTruthy();
    expect(toastMessage).toHaveBeenCalledTimes(1);
    expect(toastMessage).toHaveBeenCalledWith("장소 정보를 찾을 수 없어요", {
      id: "nearby-place-not-found",
    });
    toastMessage.mockRestore();
  });

  it("오프라인이라 추천 첫 조회가 멈춰 있으면 place_id를 지우지 않는다", async () => {
    // 오프라인이면 첫 조회가 멈춰(paused) isLoading은 false, 결과가 없어 isPending은 true다.
    onlineManager.setOnline(false);
    const toastMessage = vi.spyOn(toast, "message");
    try {
      renderResult({
        path: `${LIST_PATH}&place_id=9001`,
        prefillMidpoint: false,
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(currentUrl().searchParams.get("place_id")).toBe("9001");
      expect(toastMessage).not.toHaveBeenCalled();
    } finally {
      toastMessage.mockRestore();
      onlineManager.setOnline(true);
    }
  });

  it("주변 살펴보기 탭이 아닌 주소의 place_id는 토스트 없이 지운다", async () => {
    const toastMessage = vi.spyOn(toast, "message");
    renderResult({
      path: "/meetings/m1/location/stations?station_id=101&tab=routes&place_id=9000",
    });

    await screen.findByText("출발지 관리하기");
    expect(currentUrl().searchParams.has("place_id")).toBe(false);
    expect(searchNearbyPlaces).not.toHaveBeenCalled();
    expect(toastMessage).not.toHaveBeenCalled();
    toastMessage.mockRestore();
  });

  it("목록에서 고르고 닫는 동안 카카오는 처음 목록을 찾을 때 한 번만 부른다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(listCard("9001"));
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    fireEvent.click(listCard("9000"));
    await screen.findByRole("heading", { name: "모여 스터디룸" });

    expect(searchNearbyPlaces).toHaveBeenCalledTimes(1);
  });

  it("링크로 열면 목록을 한 번 찾아 그 결과에서 장소를 고르고, 찾았으면 토스트를 띄우지 않는다", async () => {
    const toastMessage = vi.spyOn(toast, "message");
    renderResult({ path: `${LIST_PATH}&place_id=9000` });

    await screen.findByRole("heading", { name: "모여 스터디룸" });
    expect(searchNearbyPlaces).toHaveBeenCalledTimes(1);
    expect(searchNearbyPlaces).toHaveBeenCalledWith({
      ...STATION,
      category: "스터디룸",
    });
    expect(toastMessage).not.toHaveBeenCalled();
    toastMessage.mockRestore();
  });

  it("고르면 카드 제목으로, 닫으면 방금 고른 목록 카드로 포커스를 옮긴다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");

    listCard("9001").focus();
    fireEvent.click(listCard("9001"));
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { name: "을지 스터디카페" }),
    );

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(document.activeElement).toBe(listCard("9001"));
  });

  it("링크로 바로 열면 포커스를 옮기지 않는다", async () => {
    renderResult({ path: `${LIST_PATH}&place_id=9001` });
    const title = await screen.findByRole("heading", {
      name: "을지 스터디카페",
    });

    expect(document.activeElement).not.toBe(title);
  });
});

/**
 * 지도 대역. 경도와 위도 0.00001도를 1px로 바꾸는 단순한 투영이고, 컨테이너는 375x812, 확대 단계는 늘 16이다
 * (setZoom은 부른 것만 남긴다). 네이버 지도처럼 panTo는 움직이는 동안 중심을 출발점으로 돌려주다가 한 틱 뒤에
 * 도착하고, setCenter는 바로 옮긴다. 결과 화면은 지도를 맞출 때마다 setZoom과 setCenter를 한 번씩 부른다.
 */
function createFakeMap() {
  let center = { lat: STATION.latitude, lng: STATION.longitude };
  const toOffset = (coord: { lat: number; lng: number }) => ({
    x: (coord.lng - 126.9) * 100000,
    y: (37.6 - coord.lat) * 100000,
  });

  class LatLng {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number) {
      this.lat = lat;
      this.lng = lng;
    }
  }
  (window as unknown as { naver: unknown }).naver = {
    maps: {
      LatLng,
      Point: class {
        x: number;
        y: number;
        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
        }
      },
      Event: {
        addListener: () => ({}),
        removeListener: () => undefined,
      },
    },
  };

  return {
    getSize: () => ({ width: 375, height: 812 }),
    getCenter: () => new LatLng(center.lat, center.lng),
    getProjection: () => ({
      fromCoordToOffset: toOffset,
      fromOffsetToCoord: (point: { x: number; y: number }) =>
        new LatLng(37.6 - point.y / 100000, 126.9 + point.x / 100000),
    }),
    getZoom: () => 16,
    setZoom: vi.fn(),
    panTo: vi.fn((target: LatLng) => {
      setTimeout(() => {
        center = { lat: target.lat, lng: target.lng };
      }, 0);
    }),
    setCenter: vi.fn((target: LatLng) => {
      center = { lat: target.lat, lng: target.lng };
    }),
  };
}

/** 대역 지도의 panTo가 도착할 때까지 기다린다. */
async function settleMap() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

/** 고른 상태 시트(손잡이 36px + 카드 90px = 126px)의 절반, 대역 투영(1px = 위도 0.00001도)으로 63px. */
const FITTED_SHEET_HALF_LAT = 0.00063;

// 역보다 380m(위도 0.0038도, 대역 투영으로 380px) 위에 있는 장소.
const PLACE_ABOVE: NearbyPlace = {
  ...PLACES[0],
  latitude: STATION.latitude + 0.0038,
};

const FOOD_PATH = `/meetings/m1/location/stations?station_id=101&tab=nearby&category=${encodeURIComponent("식당")}`;

function chip(name: string) {
  return screen.getByRole("button", { name });
}

describe("식당 조건(#273)", () => {
  it("식당이면 조건 스위치를 보여 주고 처음에는 가까운 순으로 찾는다", async () => {
    renderResult({ path: FOOD_PATH });
    await screen.findByText("을지 스터디카페");

    expect(chip("가까운 순").getAttribute("aria-pressed")).toBe("true");
    expect(chip("맛집").getAttribute("aria-pressed")).toBe("false");
    expect(chip("단체").getAttribute("aria-pressed")).toBe("false");
    expect(searchNearbyPlaces).toHaveBeenCalledWith({
      ...STATION,
      category: "식당",
      foodCondition: "nearest",
    });
  });

  it("조건을 누르면 주소에 condition을 남기고(replace) 그 조건으로 다시 찾는다", async () => {
    renderResult({ path: FOOD_PATH });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(chip("맛집"));

    expect(currentUrl().searchParams.get("condition")).toBe("popular");
    expect(navigationType()).toBe("REPLACE");
    await vi.waitFor(() =>
      expect(searchNearbyPlaces).toHaveBeenLastCalledWith({
        ...STATION,
        category: "식당",
        foodCondition: "popular",
      }),
    );
    expect(chip("맛집").getAttribute("aria-pressed")).toBe("true");
  });

  it("다른 분류로 갔다 오면 가까운 순으로 돌아온다", async () => {
    renderResult({ path: `${FOOD_PATH}&condition=group` });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(chip("카페"));
    expect(currentUrl().searchParams.has("condition")).toBe(false);
    expect(screen.queryByRole("button", { name: "단체" })).toBeNull();

    fireEvent.click(chip("식당"));
    await vi.waitFor(() =>
      expect(searchNearbyPlaces).toHaveBeenLastCalledWith({
        ...STATION,
        category: "식당",
        foodCondition: "nearest",
      }),
    );
    expect(chip("가까운 순").getAttribute("aria-pressed")).toBe("true");
  });

  it("이미 고른 식당 칩을 다시 누르면 조건을 그대로 둔다", async () => {
    renderResult({ path: `${FOOD_PATH}&condition=popular` });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(chip("식당"));

    expect(currentUrl().searchParams.get("condition")).toBe("popular");
    expect(chip("맛집").getAttribute("aria-pressed")).toBe("true");
  });

  it("조건이 담긴 장소 링크는 같은 조건의 결과에서 장소를 찾고, 고른 상태에서는 조건 스위치를 숨긴다", async () => {
    renderResult({ path: `${FOOD_PATH}&condition=group&place_id=9001` });

    await screen.findByRole("heading", { name: "을지 스터디카페" });
    expect(searchNearbyPlaces).toHaveBeenCalledTimes(1);
    expect(searchNearbyPlaces).toHaveBeenCalledWith({
      ...STATION,
      category: "식당",
      foodCondition: "group",
    });
    expect(screen.queryByRole("button", { name: "단체" })).toBeNull();
    expect(currentUrl().searchParams.get("condition")).toBe("group");
  });

  it("식당이 아니면 주소에 condition이 있어도 조건 없이 찾는다", async () => {
    renderResult({ path: `${LIST_PATH}&condition=popular` });
    await screen.findByText("을지 스터디카페");

    expect(searchNearbyPlaces).toHaveBeenCalledWith({
      ...STATION,
      category: "스터디룸",
    });
    expect(screen.queryByRole("button", { name: "맛집" })).toBeNull();
  });
});

describe("고른 상태의 지도(#271)", () => {
  let restoreSize: () => void;

  beforeEach(() => {
    // jsdom은 레이아웃이 없다. 고른 장소 핀 상자(이름표와 큰 핀)를 120x90으로 둔다.
    const width = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetWidth",
    );
    const height = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetHeight",
    );
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get: () => 120,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get: () => 90,
    });
    restoreSize = () => {
      if (width)
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", width);
      if (height)
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", height);
    };
  });

  afterEach(() => {
    restoreSize();
  });

  it("장소를 고르면 시트 높이가 바뀌어도 지도를 다시 맞추지 않고, 닫으면 다시 맞춘다", async () => {
    const map = createFakeMap();
    renderResult({
      path: LIST_PATH,
      mapInst: map as unknown as naver.maps.Map,
    });
    await screen.findByText("을지 스터디카페");
    await settleMap();
    const fitsBeforeSelect = map.setZoom.mock.calls.length;
    expect(fitsBeforeSelect).toBeGreaterThan(0);

    // 을지 스터디카페는 목록 지도에서 다 보인다. 옮기지도 않는다.
    map.panTo.mockClear();
    fireEvent.click(listCard("9001"));
    await settleMap();

    expect(map.setZoom).toHaveBeenCalledTimes(fitsBeforeSelect);
    expect(map.panTo).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    await settleMap();

    expect(map.setZoom.mock.calls.length).toBeGreaterThan(fitsBeforeSelect);
    expect(map.panTo).not.toHaveBeenCalled();
  });

  it("목록에서 고른 장소의 이름표가 화면 위로 나가면 그 장소를 시트 위 영역 가운데로 옮긴다", async () => {
    vi.mocked(searchNearbyPlaces).mockResolvedValue([PLACE_ABOVE, PLACES[1]]);
    const map = createFakeMap();
    renderResult({
      path: LIST_PATH,
      mapInst: map as unknown as naver.maps.Map,
    });
    await screen.findByText("을지 스터디카페");
    await settleMap();
    map.panTo.mockClear();
    const fitsBeforeSelect = map.setZoom.mock.calls.length;

    fireEvent.click(listCard("9000"));
    await settleMap();

    expect(map.setZoom).toHaveBeenCalledTimes(fitsBeforeSelect);
    expect(map.panTo).toHaveBeenCalledTimes(1);
    // 고른 상태의 시트는 카드 높이에 맞춘다. 이 묶음은 모든 요소 높이를 90px로 두어 시트가 손잡이 36px + 90px = 126px다.
    // 시트 높이의 절반(63px, 대역 투영으로 위도 0.00063도)만큼 장소보다 아래를 중심으로 잡아, 장소가 시트 위 영역 가운데에 온다.
    const [target] = map.panTo.mock.calls[0] as [{ lat: number; lng: number }];
    expect(target.lng).toBeCloseTo(PLACE_ABOVE.longitude, 6);
    expect(target.lat).toBeCloseTo(
      PLACE_ABOVE.latitude - FITTED_SHEET_HALF_LAT,
      6,
    );
  });

  it("링크로 바로 열면 목록처럼 한 번 맞춘 자리에서 고른 장소가 가려졌는지 보고 옮긴다", async () => {
    vi.mocked(searchNearbyPlaces).mockResolvedValue([PLACE_ABOVE, PLACES[1]]);
    const map = createFakeMap();
    renderResult({
      path: `${LIST_PATH}&place_id=9000`,
      mapInst: map as unknown as naver.maps.Map,
    });
    await screen.findByRole("heading", { name: "모여 스터디룸" });
    await settleMap();

    // 맞춤은 한 번이고 움직임 없이 옮긴다. 움직이는 동안 중심을 출발점으로 읽으면 가려진 것을 놓친다.
    expect(map.setZoom).toHaveBeenCalledTimes(1);
    expect(map.setCenter).toHaveBeenCalledTimes(1);
    expect(map.panTo).toHaveBeenCalledTimes(1);
    const [target] = map.panTo.mock.calls[0] as [{ lat: number; lng: number }];
    expect(target.lat).toBeCloseTo(
      PLACE_ABOVE.latitude - FITTED_SHEET_HALF_LAT,
      6,
    );
  });
});

// 회의실 결과. 스터디룸 결과(PLACES)와 자리와 이름이 다르다. 이름과 주소는 지어낸 것이다.
const MEETING_ROOMS: NearbyPlace[] = [
  {
    id: "9100",
    name: "모여 회의실",
    address: "서울 중구 을지로 120",
    distanceMeters: 330,
    latitude: 37.569,
    longitude: 126.989,
    placeUrl: "https://place.map.kakao.com/9100",
  },
  {
    id: "9101",
    name: "을지 미팅룸",
    address: "서울 중구 을지로 121",
    distanceMeters: 450,
    latitude: 37.563,
    longitude: 126.996,
    placeUrl: "https://place.map.kakao.com/9101",
  },
];

const MEETING_ROOM_PATH = `/meetings/m1/location/stations?station_id=101&tab=nearby&category=${encodeURIComponent("회의실")}`;

/**
 * 다음 검색을 끝내지 않고 붙잡는다. 돌려준 함수로 결과를 넘기면 끝난다. 새 결과를 받는 동안을 본다.
 * TanStack Query는 결과를 다음 틱에 알리므로, 끝낸 뒤 한 틱을 더 기다린다.
 */
function holdNextSearch() {
  let resolve: (places: NearbyPlace[]) => void = () => undefined;
  const pending = new Promise<NearbyPlace[]>((done) => {
    resolve = done;
  });
  vi.mocked(searchNearbyPlaces).mockReturnValueOnce(pending);

  return async (places: NearbyPlace[]) => {
    await act(async () => {
      resolve(places);
      await pending;
      await new Promise((tick) => setTimeout(tick, 0));
    });
  };
}

/** 장소 카드 목록. 새 결과를 받는 동안인지(aria-busy)를 단다. */
function placeList(placeId: string) {
  const list = listCard(placeId).closest<HTMLElement>("[aria-busy]");
  if (!list) throw new Error(`카드 목록 없음: ${placeId}`);
  return list;
}

function pinIcon(pin: HTMLElement) {
  return pin.querySelector("svg")?.outerHTML;
}

describe("분류와 조건을 바꿀 때(#275)", () => {
  it("분류를 바꾸면 지도를 움직임 없이 한 번에 맞추고, 점들의 한가운데를 여백 안쪽 띠의 가운데에 둔다", async () => {
    const map = createFakeMap();
    renderResult({
      path: LIST_PATH,
      mapInst: map as unknown as naver.maps.Map,
    });
    await screen.findByText("을지 스터디카페");
    await settleMap();
    vi.mocked(searchNearbyPlaces).mockResolvedValue(MEETING_ROOMS);
    map.panTo.mockClear();
    map.setZoom.mockClear();
    map.setCenter.mockClear();

    fireEvent.click(chip("회의실"));
    await screen.findByText("모여 회의실");
    await settleMap();

    // 예전에는 맞춘 뒤 panTo로 1초 동안 옮겼다.
    expect(map.panTo).not.toHaveBeenCalled();
    expect(map.setZoom).toHaveBeenCalledTimes(1);
    expect(map.setCenter).toHaveBeenCalledTimes(1);

    // 역과 회의실 두 곳의 한가운데(위도 37.566, 경도 126.9925)를 여백 안쪽 띠의 가운데에 둔다.
    // 지도 중심은 컨테이너 한가운데(406px)에 그려지므로 그 자리보다 (406 - 띠 가운데)px 아래다.
    const sheetHeight = Number(screen.getByTestId("sheet-height").textContent);
    const padding = getMapFitPadding({ mapHeight: 812, sheetHeight });
    if (!padding) throw new Error("여백 없음");
    const anchorY = getFitAnchorY({ mapHeight: 812, padding });
    const [target] = map.setCenter.mock.calls[0] as [
      { lat: number; lng: number },
    ];
    expect(target.lng).toBeCloseTo(126.9925, 6);
    expect(target.lat).toBeCloseTo(37.566 - (406 - anchorY) / 100000, 6);
  });

  it("새 결과를 받는 동안 이전 핀과 카드를 흐리게 남기고, 누르거나 키보드로 옮겨 가지 못한다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");
    expect(placeList("9001").getAttribute("aria-busy")).toBe("false");
    const finish = holdNextSearch();

    fireEvent.click(chip("회의실"));

    // 칩은 바로 바뀌고, 카드와 핀은 이전 결과(스터디룸)가 흐리게 남는다.
    expect(chip("회의실").getAttribute("aria-pressed")).toBe("true");
    const list = placeList("9001");
    expect(list.getAttribute("aria-busy")).toBe("true");
    expect(list.hasAttribute("inert")).toBe(true);
    expect(list.className).toContain("opacity-40");
    const pins = screen.getAllByTestId("map-pin");
    expect(pins).toHaveLength(2);
    expect(pins.every((pin) => pin.innerHTML.includes("opacity-40"))).toBe(
      true,
    );

    fireEvent.click(pins[0]);
    expect(currentUrl().searchParams.has("place_id")).toBe(false);

    await finish(MEETING_ROOMS);

    expect(screen.queryByText("을지 스터디카페")).toBeNull();
    const newList = placeList("9100");
    expect(newList.getAttribute("aria-busy")).toBe("false");
    expect(newList.hasAttribute("inert")).toBe(false);
    expect(newList.className).not.toContain("opacity-40");
    expect(
      screen
        .getAllByTestId("map-pin")
        .some((pin) => pin.innerHTML.includes("opacity-40")),
    ).toBe(false);
  });

  it("이전 결과의 핀은 새 결과가 올 때까지 이전 분류의 아이콘으로 그린다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");
    const studyRoomIcon = pinIcon(screen.getAllByTestId("map-pin")[0]);
    expect(studyRoomIcon).toBeTruthy();
    const finish = holdNextSearch();

    fireEvent.click(chip("회의실"));
    expect(pinIcon(screen.getAllByTestId("map-pin")[0])).toBe(studyRoomIcon);

    await finish(MEETING_ROOMS);
    expect(pinIcon(screen.getAllByTestId("map-pin")[0])).not.toBe(
      studyRoomIcon,
    );
  });

  it("식당 조건을 바꿀 때도 새 결과를 받는 동안 이전 결과를 남긴다", async () => {
    renderResult({ path: FOOD_PATH });
    await screen.findByText("을지 스터디카페");
    const finish = holdNextSearch();

    fireEvent.click(chip("맛집"));

    expect(placeList("9001").getAttribute("aria-busy")).toBe("true");
    await finish(MEETING_ROOMS);
    expect(placeList("9100").getAttribute("aria-busy")).toBe("false");
  });

  it("역을 바꾸면 다른 역 주변 장소가 남지 않게 비우고 새로 찾는다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");
    const finish = holdNextSearch();

    fireEvent.click(screen.getByRole("button", { name: /서울역/ }));

    expect(document.querySelector("button[data-place-id]")).toBeNull();
    expect(screen.queryAllByTestId("map-pin")).toHaveLength(0);
    await finish(MEETING_ROOMS);
    expect(screen.getByText("모여 회의실")).toBeTruthy();
  });

  it("개인별 루트 탭에 갔다 오면 이전 결과를 남기지 않고 새로 찾는다", async () => {
    renderResult({ path: LIST_PATH });
    await screen.findByText("을지 스터디카페");

    fireEvent.click(screen.getByRole("tab", { name: "개인별 루트" }));
    // 탭을 닫으면 받은 장소는 다음 틱에 버려진다(gcTime 0). 사람이 탭을 오가는 사이는 그보다 길다.
    await settleMap();
    const finish = holdNextSearch();
    fireEvent.click(screen.getByRole("tab", { name: "주변 살펴보기" }));

    expect(document.querySelector("button[data-place-id]")).toBeNull();
    await finish(PLACES);
    expect(placeList("9001").getAttribute("aria-busy")).toBe("false");
  });

  it("앞으로 가기로 다른 분류의 고른 상태에 가면, 새 결과를 받기 전에는 찾지 못했다고 하지 않는다", async () => {
    const toastMessage = vi.spyOn(toast, "message");
    renderResult({
      path: LIST_PATH,
      forwardPath: `${MEETING_ROOM_PATH}&place_id=9100`,
    });
    await screen.findByText("을지 스터디카페");
    const finish = holdNextSearch();

    act(() => {
      historyNavigate?.(1);
    });

    // 남겨 둔 스터디룸 결과에는 9100이 없지만, 회의실 결과를 받기 전이라 지우지 않는다.
    expect(currentUrl().searchParams.get("place_id")).toBe("9100");
    expect(toastMessage).not.toHaveBeenCalled();

    await finish(MEETING_ROOMS);

    expect(
      await screen.findByRole("heading", { name: "모여 회의실" }),
    ).toBeTruthy();
    expect(currentUrl().searchParams.get("place_id")).toBe("9100");
    expect(toastMessage).not.toHaveBeenCalled();
    toastMessage.mockRestore();
  });
});
