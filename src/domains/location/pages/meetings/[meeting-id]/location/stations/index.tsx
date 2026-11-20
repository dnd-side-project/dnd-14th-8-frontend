import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router";
import { Empty1Character } from "@/assets/characters";
import PlaceholderGraphic from "@/assets/graphic/placeholder.svg?react";
import { BottomSheet } from "@/domains/location/components/bottom-sheet";
import { CardLocationMember } from "@/domains/location/components/card-location-member";
import { DotPin } from "@/domains/location/components/dot-pin";
import {
  FacilityPinDefault,
  type FacilityType,
} from "@/domains/location/components/facility-pin";
import { LayeredMarker } from "@/domains/location/components/layered-marker";
import { MapMarker } from "@/domains/location/components/map-marker";
import { NearbyPlacesPanel } from "@/domains/location/components/nearby-places-panel";
import { StationCard } from "@/domains/location/components/station-card";
import { TextPin } from "@/domains/location/components/text-pin";
import { LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS } from "@/domains/location/constants/live-query-options";
import {
  LOCATION_QUERY_PARAMS,
  parseResultTab,
  RESULT_TAB_VALUES,
  ROUTE_TAB_VALUES,
} from "@/domains/location/constants/location-query-params";
import {
  NEARBY_FACILITY_TYPE,
  type NearbyCategory,
  parseNearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import { useGetDepartures } from "@/domains/location/hooks/use-get-departures";
import { useGetMidpointRecommendations } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { useNearbyPlaces } from "@/domains/location/hooks/use-nearby-places";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import type {
  RouteDto,
  StationRecommendationDto,
} from "@/domains/location/types/location-api-types";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
import { formatStationName } from "@/domains/location/utils/format";
import {
  canManageDepartures,
  getInsufficientDepartureCopy,
} from "@/domains/location/utils/insufficient-departures";
import {
  getMapFitPadding,
  getVisibleCenterOffsetY,
} from "@/domains/location/utils/map-viewport";
import { buildPlaceDetailPath } from "@/domains/location/utils/nearby-paths";
import { getPinShape, type PinShape } from "@/domains/location/utils/pin-shape";
import { hasVoteId } from "@/domains/meeting/utils/vote-id";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";
import { FixedBottomArea } from "@/shared/components/fixed-bottom-area";
import { ParticipantCount } from "@/shared/components/participant-count";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { Tab } from "@/shared/components/tab";
import { useShareSheet } from "@/shared/hooks/use-share-sheet";
import {
  attachRevealFocusedChip,
  revealInScroller,
} from "@/shared/utils/reveal-in-scroller";

/** 점이 하나일 때의 확대 단계. 핀 옆 역 이름과 동 이름이 읽히는 정도다. */
const SINGLE_POINT_ZOOM = 15;
/**
 * 여러 점을 맞출 때 들어갈 수 있는 가장 큰 확대 단계. 출발지가 모두 고른 역
 * 가까이에 모여 있으면 fitBounds가 건물 단위(18 이상)까지 확대해 어느 동네인지
 * 알 수 없다. 16은 주변 건물과 길 이름이 보이면서, 가까운 이름표끼리 덜 겹치는
 * 단계다.
 */
const MAX_FIT_ZOOM = 16;

/**
 * 지도 핀을 쌓는 순서. 아래부터 모여락 핀(LayeredMarker의 아이콘 층, 80), 남의 점,
 * 내 점, 남의 이름표, 내 이름표, 주변 장소 핀, 역 이름표다. 내 것은 남의 것 위에 온다.
 * 주변 장소 핀은 주변 살펴보기 탭에서만 있고 그때 사람 핀은 숨는다.
 */
const PIN_Z_INDEX = {
  otherDot: 84,
  myDot: 86,
  otherLabel: 90,
  myLabel: 100,
  place: 110,
  stationLabel: 120,
} as const;

/** 추천이 없을 때 쓰는 빈 목록. 렌더마다 새 배열을 만들면 지도 맞춤 effect가 다시 돈다. */
const EMPTY_RECOMMENDATIONS: StationRecommendationDto[] = [];
/** 주변 장소를 찾지 못했을 때 쓰는 빈 목록. 같은 이유로 하나만 둔다. */
const EMPTY_NEARBY_PLACES: NearbyPlace[] = [];

const RESULT_TABS = [
  { id: RESULT_TAB_VALUES.routes, label: "개인별 루트" },
  { id: RESULT_TAB_VALUES.nearby, label: "주변 살펴보기" },
];

/** 지도를 맞췄으면 true, 맞출 수 없어 그대로 뒀으면 false를 돌려준다. */
function fitMapBounds({
  mapInst,
  sheetHeight,
  points,
}: {
  mapInst: naver.maps.Map;
  sheetHeight: number;
  points: { latitude: number; longitude: number }[];
}): boolean {
  const maps = window.naver?.maps;
  if (!maps || points.length === 0) return false;

  const [firstPoint] = points;

  // 점이 하나면 bounds 크기가 0이라 fitBounds가 최대 확대(20)까지 들어가
  // 건물만 보인다. 확대 단계를 고정하고 시트가 비워 둔 영역의 가운데로 보낸다.
  if (points.length === 1) {
    mapInst.setZoom(SINGLE_POINT_ZOOM, false);
    panToVisibleCenter({
      latitude: firstPoint.latitude,
      longitude: firstPoint.longitude,
      mapInst,
      sheetHeight,
    });
    return true;
  }

  const bounds = new maps.LatLngBounds(
    new maps.LatLng(firstPoint.latitude, firstPoint.longitude),
    new maps.LatLng(firstPoint.latitude, firstPoint.longitude),
  );

  points.slice(1).forEach((point) => {
    bounds.extend(new maps.LatLng(point.latitude, point.longitude));
  });

  const padding = getMapFitPadding({
    mapHeight: mapInst.getSize().height,
    sheetHeight,
  });
  // 시트가 지도를 거의 다 덮은 상태(full 스냅)면 맞출 여지가 없다.
  // 억지로 맞추는 대신 마지막 프레이밍을 그대로 둔다.
  if (!padding) return false;

  mapInst.fitBounds(bounds, padding);

  if (mapInst.getZoom() <= MAX_FIT_ZOOM) return true;

  // 확대를 낮추면 fitBounds가 잡은 중심이 어긋난다. 점들의 한가운데를
  // 시트가 비워 둔 영역의 가운데로 다시 보낸다.
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);

  mapInst.setZoom(MAX_FIT_ZOOM, false);
  panToVisibleCenter({
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    mapInst,
    sheetHeight,
  });
  return true;
}

/**
 * 바텀시트가 지도 아래를 덮고 있으므로, 좌표를 컨테이너 정중앙이 아니라
 * 시트가 비워둔 영역의 한가운데로 보낸다. 그냥 panTo 하면 fitMapBounds가
 * 준 하단 패딩이 무시되고 선택한 역이 시트 뒤로 숨는다.
 */
function panToVisibleCenter({
  latitude,
  longitude,
  mapInst,
  sheetHeight,
}: {
  latitude: number;
  longitude: number;
  mapInst: naver.maps.Map;
  sheetHeight: number;
}) {
  const maps = window.naver?.maps;
  if (!maps) return;

  const target = new maps.LatLng(latitude, longitude);
  const projection = mapInst.getProjection();
  const offset = projection.fromCoordToOffset(target);

  mapInst.panTo(
    projection.fromOffsetToCoord(
      new maps.Point(
        offset.x,
        getVisibleCenterOffsetY({
          mapHeight: mapInst.getSize().height,
          sheetHeight,
          targetOffsetY: offset.y,
        }),
      ),
    ),
  );
}

/** 주소의 역이 추천 목록에 없으면 1순위 역을 고른다. */
function findSelectedStation(
  recommendations: StationRecommendationDto[],
  stationId: number,
) {
  return (
    recommendations.find((station) => station.stationId === stationId) ??
    recommendations.find((station) => station.rank === 1) ??
    recommendations[0] ??
    null
  );
}

/**
 * 역 카드 줄의 ref. 줄이 처음 그려질 때 고른 카드가 다 보이지 않으면(예: 다섯 번째 역을
 * 고른 채 열었을 때) 가운데로 넘겨 양옆 카드도 함께 보이게 한다. 그 뒤 카드를 눌러
 * 고를 때는 줄을 움직이지 않는다. 키보드로 옮긴 카드는 링까지 보이게 넘긴다.
 */
function attachStationCardRow(scroller: HTMLElement | null) {
  if (!scroller) return;

  const selectedCard = scroller.querySelector<HTMLElement>(
    '[aria-pressed="true"]',
  );
  if (selectedCard) {
    revealInScroller(scroller, selectedCard, { align: "center" });
  }

  return attachRevealFocusedChip(scroller);
}

/**
 * 주변 장소 핀. 누르면 장소 상세로 간다. 축소해도 점으로 바꾸지 않는다(점은 사람 핀이 겹치는 문제만 푼다).
 * MapMarker는 onClick이 바뀌면 핀을 지도에서 내렸다 다시 올리므로, 장소마다 고정한 함수를 넘긴다.
 */
function NearbyPlacePin({
  place,
  type,
  onSelect,
}: {
  place: NearbyPlace;
  type: FacilityType;
  onSelect: (place: NearbyPlace) => void;
}) {
  const handleClick = useCallback(() => onSelect(place), [onSelect, place]);

  return (
    <MapMarker
      latitude={place.latitude}
      longitude={place.longitude}
      zIndex={PIN_Z_INDEX.place}
      onClick={handleClick}
    >
      <FacilityPinDefault type={type} />
    </MapMarker>
  );
}

export function LocationMainPage() {
  const navigate = useNavigate();
  const { share } = useShareSheet();
  const { meetingId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight, setMapBlurred } =
    useOutletContext<MapPageOutletContext>();

  const { data: departures } = useGetDepartures({
    meetingId,
    ...LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS,
  });

  // 출발지가 하나도 없으면 지도에 보여 줄 것이 없으니 흐리게 배경으로만 둔다.
  // 목록을 받기 전(undefined)에는 흐리게 하지 않는다. 다른 화면으로 가면 되돌린다.
  const hasNoDepartures = departures?.length === 0;

  useEffect(() => {
    setMapBlurred(hasNoDepartures);

    return () => {
      setMapBlurred(false);
    };
  }, [hasNoDepartures, setMapBlurred]);
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyParticipant({
    meetingId,
  });
  const { data: midpoint, isLoading: isMidpointLoading } =
    useGetMidpointRecommendations({
      meetingId,
      ...LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS,
    });

  const recommendations = midpoint?.recommendations ?? EMPTY_RECOMMENDATIONS;
  const stationId = Number(searchParams.get(LOCATION_QUERY_PARAMS.stationId));

  const selectedStation = useMemo(
    () => findSelectedStation(recommendations, stationId),
    [recommendations, stationId],
  );

  useEffect(() => {
    if (!selectedStation) return;

    const current = searchParams.get(LOCATION_QUERY_PARAMS.stationId);
    if (current === String(selectedStation.stationId)) return;

    const next = new URLSearchParams(searchParams);
    next.set(
      LOCATION_QUERY_PARAMS.stationId,
      String(selectedStation.stationId),
    );
    setSearchParams(next, { replace: true });
  }, [searchParams, selectedStation, setSearchParams]);

  /**
   * 시트의 탭과 주변 살펴보기 분류는 주소 쿼리에 둔다(#269). 값이 없으면 개인별 루트와 첫 분류다.
   * 주변 살펴보기 탭은 추천역이 있을 때만 있어서, 추천이 없는 화면은 주소에 tab=nearby가 있어도
   * 개인별 루트처럼 사람 핀을 보여 준다.
   */
  const resultTab = parseResultTab(
    searchParams.get(LOCATION_QUERY_PARAMS.resultTab),
  );
  const nearbyCategory = parseNearbyCategory(
    searchParams.get(LOCATION_QUERY_PARAMS.nearbyCategory),
  );
  const isNearbyTab =
    resultTab === RESULT_TAB_VALUES.nearby && selectedStation !== null;

  /**
   * 주변 장소는 주변 살펴보기 탭을 연 동안만 찾는다. 탭을 닫으면 좌표를 넘기지 않아 쿼리 키가
   * 바뀌고, 받은 장소는 바로 버려진다(gcTime 0). enabled만 끄면 화면이 같은 키를 계속 보고 있어
   * 결과가 남는다. 탭을 다시 열면 새로 찾는다.
   */
  const nearbyStation = isNearbyTab ? selectedStation : null;
  const nearbyPlacesQuery = useNearbyPlaces({
    latitude: nearbyStation?.latitude ?? Number.NaN,
    longitude: nearbyStation?.longitude ?? Number.NaN,
    category: nearbyCategory,
    enabled: nearbyStation !== null,
  });
  // 찾는 중이거나 탭을 닫았으면 undefined다. 찾지 못했으면(오류) 장소가 없을 때와 같게 둔다.
  const nearbyPlaces = nearbyPlacesQuery.isError
    ? EMPTY_NEARBY_PLACES
    : nearbyPlacesQuery.data;

  const departurePoints = useMemo(
    () =>
      (departures ?? []).map((locationVote) => ({
        latitude: locationVote.departureLat,
        longitude: locationVote.departureLng,
      })),
    [departures],
  );
  const placePoints = useMemo(
    () =>
      nearbyPlaces?.map((place) => ({
        latitude: place.latitude,
        longitude: place.longitude,
      })),
    [nearbyPlaces],
  );
  /**
   * 고른 역과 함께 지도에 담을 점. 개인별 루트 탭은 출발지, 주변 살펴보기 탭은 고른 분류의 장소다.
   * 장소를 찾는 중이면 undefined라 아직 맞추지 않고, 받으면 그때 맞춘다. 탭을 바꾸면 이 값이
   * 바뀌어 그 탭의 점에 다시 맞춘다.
   */
  const fitPoints = isNearbyTab ? placePoints : departurePoints;

  /**
   * 지도는 고른 역과 출발지(주변 살펴보기 탭에서는 장소)만 담는다. 고르지 않은 추천역은 지도에 없다.
   *
   * 고른 역은 ref로 읽어 deps에 넣지 않는다. 넣으면 다른 역을 고를 때마다 지도를
   * 다시 맞춰 확대가 바뀐다. 역을 고를 때는 아래 panToVisibleCenter가 그 역을
   * 가운데로 옮기기만 한다. 주변 살펴보기 탭에서는 역을 바꾸면 장소도 바뀌어, 새 장소를
   * 받을 때 다시 맞춘다.
   */
  const stationIdRef = useRef(stationId);

  useEffect(() => {
    stationIdRef.current = stationId;
  }, [stationId]);

  /**
   * 핀을 이름표로 그릴지 점으로 그릴지(getPinShape). 기준은 지도를 맞춘 직후의 확대
   * 단계이고, 시트를 움직이거나 출발지가 바뀌어 지도를 다시 맞추면 새로 잡는다.
   * 기준은 ref로 두고 모양만 state로 둬서, 확대가 바뀌어도 모양이 그대로면 다시 그리지 않는다.
   */
  const fitZoomRef = useRef<number | null>(null);
  const isFittingRef = useRef(false);
  const [pinShape, setPinShape] = useState<PinShape>("label");

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !maps) return;

    const listener = maps.Event.addListener(mapInst, "zoom_changed", () => {
      // 지도를 맞추는 중이면 아래 효과가 기준과 모양을 새로 정한다. 효과 안에서는
      // flushSync를 부를 수 없어서 여기서 건너뛴다.
      if (isFittingRef.current) return;

      // 확대 단계가 정해진 그 자리에서 바로 그린다. 데스크톱 Chrome과 Edge에서는
      // 네이버 지도가 확대하는 동안 핀 층을 숨겼다가 zoom_changed 바로 뒤에 다시
      // 보인다(휴대폰은 NaverMap의 overlayZoomEffect로 숨기지 않는다). 평소처럼
      // React가 나중에 그리면 층이 먼저 보여 예전 모양이 한 프레임 비친다.
      flushSync(() => {
        setPinShape(
          getPinShape({ zoom: mapInst.getZoom(), fitZoom: fitZoomRef.current }),
        );
      });
    });

    return () => {
      maps.Event.removeListener(listener);
    };
  }, [mapInst]);

  useEffect(() => {
    if (!mapInst || !fitPoints) return;

    const station = findSelectedStation(recommendations, stationIdRef.current);
    const points = [
      ...(station
        ? [{ latitude: station.latitude, longitude: station.longitude }]
        : []),
      ...fitPoints,
    ];

    // 맞추는 도중에도 zoom_changed가 나지만, 위 리스너는 건너뛰고 아래에서 정한다.
    isFittingRef.current = true;
    let fitted: boolean;
    try {
      fitted = fitMapBounds({ mapInst, sheetHeight, points });
    } finally {
      isFittingRef.current = false;
    }

    // 맞추지 않고 그대로 뒀으면(시트를 끝까지 올렸을 때) 기준도 그대로 둔다.
    if (!fitted) return;

    // 맞춘 확대 단계를 새 기준으로 잡고 이름표로 되돌린다.
    fitZoomRef.current = mapInst.getZoom();
    setPinShape("label");
  }, [mapInst, sheetHeight, recommendations, fitPoints]);

  /**
   * sheetHeight를 deps에 넣지 않는다. 넣으면 스냅이 바뀔 때마다 panTo가
   * 다시 돌아, 시트만 올렸는데 지도가 따라 움직인다. 시트 높이에 맞춘
   * 재프레이밍은 위의 fitMapBounds가 맡는다.
   */
  const sheetHeightRef = useRef(sheetHeight);

  useEffect(() => {
    sheetHeightRef.current = sheetHeight;
  }, [sheetHeight]);

  /**
   * 주변 살펴보기 탭에서는 역을 옮기지 않는다. 새 역의 장소를 받으면 위 효과가 역과 장소에 다시
   * 맞춘다. 탭은 ref로 읽는다. deps에 넣으면 탭을 바꿀 때마다 역을 가운데로 옮겨 방금 맞춘 지도가 어긋난다.
   */
  const isNearbyTabRef = useRef(isNearbyTab);

  useEffect(() => {
    isNearbyTabRef.current = isNearbyTab;
  }, [isNearbyTab]);

  useEffect(() => {
    if (!mapInst || !selectedStation) return;
    if (isNearbyTabRef.current) return;

    panToVisibleCenter({
      latitude: selectedStation.latitude,
      longitude: selectedStation.longitude,
      mapInst,
      sheetHeight: sheetHeightRef.current,
    });
  }, [mapInst, selectedStation]);

  const routeByParticipantName = useMemo(() => {
    if (!selectedStation) return new Map<string, RouteDto>();

    return new Map(
      selectedStation.routes.map((route) => [route.departureName, route]),
    );
  }, [selectedStation]);

  /**
   * myInfo가 오기 전에는 hasMyDeparture가 false라, 이미 등록한 사람에게도
   * "출발지 추가하기"가 잠깐 떴다가 "출발지 관리하기"로 바뀐다. 문구와 하단
   * 버튼이 둘 다 이 값에 기대므로 midpoint와 함께 기다렸다가 한 번에 그린다.
   */
  const isContentLoading = isMidpointLoading || isMyInfoLoading;
  const hasRecommendations = recommendations.length > 0;
  // 점일 때 사람 이름은 참여자 목록에서 본다. 추천이 없으면 참여자 목록이 없으므로 이름표로 둔다.
  const shownPinShape: PinShape = hasRecommendations ? pinShape : "label";
  const departureCount = departures?.length ?? 0;
  const registeredCount = midpoint?.registeredCount ?? departureCount;
  const totalCount = midpoint?.totalCount ?? departureCount;
  const hasMyDeparture = hasVoteId(myInfo?.locationVoteId);
  const myLocationVoteId = hasMyDeparture ? myInfo?.locationVoteId : null;
  const shouldManageDepartures = canManageDepartures({
    registeredCount,
    hasMyDeparture,
  });
  const insufficientDepartureCopy = getInsufficientDepartureCopy({
    registeredCount,
    hasMyDeparture,
  });
  const handleStationClick = (stationId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.stationId, String(stationId));
    setSearchParams(next, { replace: true });
  };

  // 탭과 분류는 역을 고를 때처럼 주소를 바꾸기만 해서(replace) 뒤로 가기 기록을 쌓지 않는다.
  const handleResultTabChange = (tabId: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.resultTab, parseResultTab(tabId));
    setSearchParams(next, { replace: true });
  };

  const handleNearbyCategoryChange = (category: NearbyCategory) => {
    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.nearbyCategory, category);
    setSearchParams(next, { replace: true });
  };

  // 장소 상세로는 새 기록을 쌓아(push) 뒤로 가기로 이 탭에 돌아오게 한다.
  const handlePlaceSelect = useCallback(
    (place: NearbyPlace) => {
      if (!selectedStation) return;

      navigate(
        buildPlaceDetailPath({
          meetingId,
          latitude: selectedStation.latitude,
          longitude: selectedStation.longitude,
          placeId: place.id,
          stationId: selectedStation.stationId,
          category: nearbyCategory,
        }),
      );
    },
    [meetingId, navigate, nearbyCategory, selectedStation],
  );

  // 주변 살펴보기 탭을 연 동안은 사람 핀(이름표와 점)을 비운다. 핀 층은 지도에 그대로 둬서 개인별 루트로 돌아오면 바로 보인다.
  const personPinShape: PinShape | null = isNearbyTab ? null : shownPinShape;

  const handleVoteAction = () => {
    if (shouldManageDepartures) {
      navigate(`/meetings/${meetingId}/location/votes`);
      return;
    }

    navigate(`/meetings/${meetingId}/location/votes/new`);
  };

  return (
    <>
      {/* 지도 핀 규칙: 역은 파란 이름표와 모여락 핀, 사람 출발지는 이름이 적힌 이름표다. 내 출발지는 파란 이름표, 다른 사람 출발지는 검은 이름표다. 지도를 맞춘 직후보다 축소하면 역은 이름표 없이 모여락 핀만, 사람은 같은 색의 점으로 그린다. 주변 살펴보기 탭을 연 동안은 사람 핀을 숨기고 고른 분류의 장소 핀을 올린다. 장소 핀은 축소해도 그대로다. 겹치면 역 이름표, 장소 핀, 내 이름표, 남의 이름표, 내 점, 남의 점, 모여락 핀 순서로 위에 온다(PIN_Z_INDEX). 고르지 않은 추천역은 지도에 그리지 않고 역 카드로만 고른다. */}
      {selectedStation && (
        <LayeredMarker
          latitude={selectedStation.latitude}
          longitude={selectedStation.longitude}
          zIndex={PIN_Z_INDEX.stationLabel}
          text={formatStationName(selectedStation.stationName)}
          variant="blue"
          size="sm"
          hideLabel={shownPinShape === "dot"}
        />
      )}

      {/* 사람마다 이름표 층과 점 층을 함께 올려 두고 지금 모양만 채운다. 모양이 바뀔 때 핀을 지도에서 내렸다 다시 올리지 않아, 모든 핀이 한 번에 바뀐다. 내 정보가 오기 전에는 모두 검은색이다. */}
      {(departures ?? []).map((locationVote) => {
        const isMine = locationVote.locationVoteId === myLocationVoteId;
        const variant = isMine ? "blue" : "black";

        return (
          <Fragment key={locationVote.locationVoteId}>
            <MapMarker
              latitude={locationVote.departureLat}
              longitude={locationVote.departureLng}
              zIndex={isMine ? PIN_Z_INDEX.myLabel : PIN_Z_INDEX.otherLabel}
            >
              {personPinShape === "label" && (
                <TextPin
                  text={locationVote.participantName}
                  variant={variant}
                />
              )}
            </MapMarker>
            <MapMarker
              latitude={locationVote.departureLat}
              longitude={locationVote.departureLng}
              zIndex={isMine ? PIN_Z_INDEX.myDot : PIN_Z_INDEX.otherDot}
              anchor="center"
            >
              {personPinShape === "dot" && (
                <DotPin text={locationVote.participantName} variant={variant} />
              )}
            </MapMarker>
          </Fragment>
        );
      })}

      {isNearbyTab &&
        (nearbyPlaces ?? []).map((place) => (
          <NearbyPlacePin
            key={place.id}
            place={place}
            type={NEARBY_FACILITY_TYPE[nearbyCategory]}
            onSelect={handlePlaceSelect}
          />
        ))}

      <BottomSheet defaultSnap="half" onHeightChange={setSheetHeight}>
        {isContentLoading ? null : hasRecommendations && selectedStation ? (
          <div className="flex flex-col gap-4 px-5 pb-[106px]">
            <h2 className="textStyle_title1 text-fg-neutral-strong">
              가장 최적의{" "}
              <span className="text-fg-brand-default">중간지점</span>
              이에요!
            </h2>

            {/* SEED 안전 영역 패턴(스크롤되는 콘텐츠)처럼 카드 줄을 화면 끝까지 잇는다. 첫 카드는 다른 콘텐츠와 같은 20px에서 시작하고, 끝까지 넘기면 마지막 카드 뒤에 20px가 남는다. 좌우 20px는 포커스 링(두께 2px, 간격 2px) 자리도 맡고, 위아래는 4px를 두고 margin으로 되돌린다. */}
            <div
              className="scrollbar-hide -mx-5 -my-1 flex gap-3 overflow-x-auto px-5 py-1"
              ref={attachStationCardRow}
            >
              {recommendations.map((station) => (
                <StationCard
                  key={station.stationId}
                  rank={station.rank}
                  name={formatStationName(station.stationName)}
                  lines={station.lines}
                  durationMinutes={Math.round(station.avgTransitDuration)}
                  selected={station.stationId === selectedStation.stationId}
                  onClick={() => handleStationClick(station.stationId)}
                />
              ))}
            </div>

            <Tab
              tabs={RESULT_TABS}
              activeTabId={resultTab}
              onTabChange={handleResultTabChange}
            />

            {isNearbyTab ? (
              <NearbyPlacesPanel
                category={nearbyCategory}
                onCategoryChange={handleNearbyCategoryChange}
                places={nearbyPlaces ?? EMPTY_NEARBY_PLACES}
                stationName={formatStationName(selectedStation.stationName)}
                onPlaceClick={handlePlaceSelect}
              />
            ) : (
              <>
                <ParticipantCount count={registeredCount} total={totalCount} />

                <div className="flex flex-col gap-2">
                  {(departures ?? []).map((locationVote) => {
                    const route = routeByParticipantName.get(
                      locationVote.participantName,
                    );
                    if (!route) return null;

                    return (
                      <CardLocationMember
                        key={locationVote.locationVoteId}
                        name={locationVote.participantName}
                        address={route.departureAddress}
                        durationMinutes={route.transitDuration}
                        unreachable={route.transitReachable === false}
                        onClick={() =>
                          navigate(
                            `/meetings/${meetingId}/location/stations/${selectedStation.stationId}/participants/${route.participantId}?${LOCATION_QUERY_PARAMS.routeTab}=${ROUTE_TAB_VALUES.transit}`,
                          )
                        }
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : midpoint?.noNearbyStations ? (
          <div className="flex min-h-full flex-col px-5 pb-[106px]">
            <PlaceholderContent
              graphic={<PlaceholderGraphic className="h-[90px] w-[104px]" />}
              title="중간지점을 찾지 못했어요"
              description="출발지들이 서로 너무 멀리 떨어져 있어요. 출발지를 다시 확인해주세요"
            />
          </div>
        ) : (
          <div className="flex min-h-full flex-col px-5 pb-[106px]">
            <ParticipantCount count={registeredCount} total={totalCount} />
            <PlaceholderContent
              graphic={<Empty1Character />}
              title={insufficientDepartureCopy.title}
              description={insufficientDepartureCopy.description}
            />
          </div>
        )}
      </BottomSheet>

      {!isContentLoading && (
        <FixedBottomArea>
          <BottomActionBarWithButtonAndShare
            onClick={handleVoteAction}
            onShare={share}
          >
            {shouldManageDepartures ? "출발지 관리하기" : "출발지 추가하기"}
          </BottomActionBarWithButtonAndShare>
        </FixedBottomArea>
      )}
    </>
  );
}
