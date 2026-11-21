import { Button } from "@moyeorak/design-system";
import { useEffect } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router";
import { BottomSheet } from "@/domains/location/components/bottom-sheet";
import { CardFacility } from "@/domains/location/components/card-facility";
import {
  FacilityPinDefault,
  FacilityPinSelected,
} from "@/domains/location/components/facility-pin";
import { MapMarker } from "@/domains/location/components/map-marker";
import { StationBadges } from "@/domains/location/components/station-badges";
import { TextPin } from "@/domains/location/components/text-pin";
import { LOCATION_QUERY_PARAMS } from "@/domains/location/constants/location-query-params";
import {
  NEARBY_FACILITY_TYPE,
  parseNearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import { useGetMidpointRecommendations } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { useNearbyPlaces } from "@/domains/location/hooks/use-nearby-places";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import { parseCoordsPath, toCoordsPath } from "@/domains/location/utils/coords";
import { formatStationName } from "@/domains/location/utils/format";
import { getMapFitPadding } from "@/domains/location/utils/map-viewport";
import { buildResultNearbyPath } from "@/domains/location/utils/nearby-paths";
import { panToVisibleCenter } from "@/domains/location/utils/pan-to-visible-center";

/**
 * 역과 장소에 맞출 때 가장 크게 확대하는 단계. 장소가 역에서 아주 가까우면 fitBounds가
 * 19, 20단계까지 확대해 길 없이 건물 윤곽만 보인다(역에서 80m는 19단계, 40m는 20단계,
 * 120m와 180m는 18단계. 375x812, 2026-11-20 측정, #269).
 */
const MAX_PLACE_FIT_ZOOM = 18;

export function PlaceDetailPage() {
  const navigate = useNavigate();
  const { meetingId = "", coords = "", placeId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight } =
    useOutletContext<MapPageOutletContext>();

  const parsedCoords = parseCoordsPath(coords);
  // 옛 분류 이름(스터디카페, 음식점)은 새 이름으로 읽는다(#269).
  const category = parseNearbyCategory(
    searchParams.get(LOCATION_QUERY_PARAMS.nearbyCategory),
  );
  const facilityType = NEARBY_FACILITY_TYPE[category];

  const { data: midpoint, isLoading: isMidpointLoading } =
    useGetMidpointRecommendations({ meetingId });
  // 주소의 좌표(검색 기준 역)에서 같은 분류를 카카오로 다시 찾는다. 카카오 결과는 저장하지 않는다(#269).
  const { data: places, isLoading: isPlacesLoading } = useNearbyPlaces({
    latitude: parsedCoords?.latitude ?? Number.NaN,
    longitude: parsedCoords?.longitude ?? Number.NaN,
    category,
  });

  const recommendations = midpoint?.recommendations ?? [];
  const stationId = Number(searchParams.get(LOCATION_QUERY_PARAMS.stationId));
  const selectedStation =
    recommendations.find((station) => station.stationId === stationId) ??
    recommendations.find((station) => station.rank === 1) ??
    recommendations[0] ??
    null;
  /**
   * 거리는 주소의 좌표(검색 기준 역)에서 잰 값이라, 카드에는 그 좌표와 같은 추천역의 이름만 쓴다.
   * 공유한 뒤 그 역이 추천에서 빠지면 위 selectedStation은 1순위 역으로 바뀌어 거리 기준과 달라지므로,
   * 그때는 역 이름과 거리를 보여 주지 않는다.
   */
  const searchStation =
    recommendations.find((station) => toCoordsPath(station) === coords) ?? null;

  // 장소 번호는 카카오 장소 ID다. 옛 백엔드 번호로 된 링크는 찾지 못해 아래 "찾을 수 없어요"가 나온다.
  const selectedPlace = places?.find((place) => place.id === placeId) ?? null;
  const isLoading = isPlacesLoading || isMidpointLoading;

  useEffect(() => {
    if (!selectedStation) return;

    const current = searchParams.get(LOCATION_QUERY_PARAMS.stationId);
    if (current === String(selectedStation.stationId)) return;

    const next = new URLSearchParams(searchParams);
    next.set(
      LOCATION_QUERY_PARAMS.stationId,
      String(selectedStation.stationId),
    );
    navigate(`?${next.toString()}`, { replace: true });
  }, [navigate, searchParams, selectedStation]);

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !selectedPlace || !maps) return;

    const points = [
      ...(selectedStation
        ? [
            {
              latitude: selectedStation.latitude,
              longitude: selectedStation.longitude,
            },
          ]
        : []),
      { latitude: selectedPlace.latitude, longitude: selectedPlace.longitude },
    ];

    const [firstPoint] = points;
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
    if (!padding) return;

    mapInst.fitBounds(bounds, padding);

    if (mapInst.getZoom() <= MAX_PLACE_FIT_ZOOM) return;

    // 확대를 낮추면 fitBounds가 잡은 중심이 어긋난다. 점들의 한가운데를
    // 시트가 비워 둔 영역의 가운데로 다시 보낸다.
    mapInst.setZoom(MAX_PLACE_FIT_ZOOM, false);

    const latitudes = points.map((point) => point.latitude);
    const longitudes = points.map((point) => point.longitude);

    panToVisibleCenter({
      latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
      longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
      mapInst,
      sheetHeight,
    });
  }, [mapInst, selectedPlace, selectedStation, sheetHeight]);

  // 주변 장소 목록은 결과 화면의 주변 살펴보기 탭이다(#269). 고른 역과 분류를 들고 간다.
  const goToNearbyTab = (nextStationId?: number) =>
    navigate(
      buildResultNearbyPath({ meetingId, stationId: nextStationId, category }),
      { replace: true },
    );

  return (
    <>
      <StationBadges
        recommendations={recommendations}
        selectedStationId={selectedStation?.stationId}
        onBack={() => navigate(-1)}
        onStationClick={(station) => goToNearbyTab(station.stationId)}
      />

      {recommendations.map((station) => (
        <MapMarker
          key={station.stationId}
          latitude={station.latitude}
          longitude={station.longitude}
          zIndex={station.stationId === selectedStation?.stationId ? 120 : 100}
        >
          <TextPin
            text={formatStationName(station.stationName)}
            variant={
              station.stationId === selectedStation?.stationId
                ? "blue"
                : "black"
            }
          />
        </MapMarker>
      ))}

      {selectedPlace &&
        places?.map((place) => (
          <MapMarker
            key={place.id}
            latitude={place.latitude}
            longitude={place.longitude}
            zIndex={place.id === selectedPlace.id ? 130 : 110}
          >
            {place.id === selectedPlace.id ? (
              <div className="flex flex-col items-center">
                <TextPin text={place.name} variant="blue" />
                <FacilityPinSelected type={facilityType} />
              </div>
            ) : (
              <FacilityPinDefault type={facilityType} />
            )}
          </MapMarker>
        ))}

      <BottomSheet defaultSnap="peek" onHeightChange={setSheetHeight}>
        <div className="flex flex-col gap-4 px-5 pb-6">
          {/* 추천역이 없어도(출발지가 모자라거나 역을 못 찾음) 찾은 장소는 이름과 자세히 보기를 보여 준다. */}
          {isLoading ? null : selectedPlace ? (
            <>
              <CardFacility
                name={selectedPlace.name}
                stationName={searchStation?.stationName}
                distanceMeters={selectedPlace.distanceMeters}
                disabled
                className="border-none px-0 py-0"
              />

              <Button
                variant="default"
                size="xl"
                display="full"
                onClick={() => window.open(selectedPlace.placeUrl, "_blank")}
              >
                자세히 보기
              </Button>
            </>
          ) : (
            <>
              <p className="textStyle_body2 text-center text-fg-neutral-subtle">
                요청한 장소 정보를 찾을 수 없어요
              </p>
              <Button
                variant="default"
                size="xl"
                display="full"
                onClick={() => goToNearbyTab(selectedStation?.stationId)}
              >
                주변 살펴보기로
              </Button>
            </>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
