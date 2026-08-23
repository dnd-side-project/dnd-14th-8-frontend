import { useEffect, useMemo, useRef } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router";
import PlaceholderGraphic from "@/assets/graphic/placeholder.svg?react";
import { BottomSheet } from "@/domains/location/components/bottom-sheet";
import { CardLocationMember } from "@/domains/location/components/card-location-member";
import { InsufficientDeparturesEmptyState } from "@/domains/location/components/insufficient-departures-empty-state";
import { MapMarker } from "@/domains/location/components/map-marker";
import { NearbyDeparturesNote } from "@/domains/location/components/nearby-departures-note";
import { NearbyPlacesFloatingButton } from "@/domains/location/components/nearby-places-floating-button";
import { TextPin } from "@/domains/location/components/text-pin";
import { LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS } from "@/domains/location/constants/live-query-options";
import {
  LOCATION_QUERY_PARAMS,
  ROUTE_TAB_VALUES,
} from "@/domains/location/constants/location-query-params";
import { useGetDepartures } from "@/domains/location/hooks/use-get-departures";
import { useGetMidpointRecommendations } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import type { RouteDto } from "@/domains/location/types/location-api-types";
import { toCoordsPath } from "@/domains/location/utils/coords";
import {
  formatDepartureDateTime,
  formatDuration,
} from "@/domains/location/utils/format";
import { getInsufficientDepartureContent } from "@/domains/location/utils/insufficient-departures";
import { getVisibleCenterOffsetY } from "@/domains/location/utils/map-viewport";
import { shouldShowNearbyDepartureNote } from "@/domains/location/utils/midpoint-result";
import { HomeExitConfirmModal } from "@/domains/meeting/components/home-exit-confirm-modal";
import { useGoHome } from "@/domains/meeting/hooks/use-go-home";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";
import { ChipButton } from "@/shared/components/chip-button";
import { HomeLogoButton } from "@/shared/components/home-logo-button";
import {
  ChevronDownIcon,
  LogoPinIcon,
  MemberIcon,
} from "@/shared/components/icons";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { useShareSheet } from "@/shared/hooks/use-share-sheet";

function fitMapBounds({
  mapInst,
  sheetHeight,
  points,
}: {
  mapInst: naver.maps.Map;
  sheetHeight: number;
  points: { latitude: number; longitude: number }[];
}) {
  const maps = window.naver?.maps;
  if (!maps || points.length === 0) return;

  const [firstPoint] = points;
  const bounds = new maps.LatLngBounds(
    new maps.LatLng(firstPoint.latitude, firstPoint.longitude),
    new maps.LatLng(firstPoint.latitude, firstPoint.longitude),
  );

  points.slice(1).forEach((point) => {
    bounds.extend(new maps.LatLng(point.latitude, point.longitude));
  });

  mapInst.fitBounds(bounds, {
    top: 80,
    bottom: Math.max(sheetHeight + 20, 140),
    left: 20,
    right: 20,
  });
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

export function LocationMainPage() {
  const navigate = useNavigate();
  const { share } = useShareSheet();
  const { meetingId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight } =
    useOutletContext<MapPageOutletContext>();

  const { data: departures } = useGetDepartures({
    meetingId,
    ...LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS,
  });
  const { data: myInfo } = useGetMyParticipant({ meetingId });
  const { cancelGoHome, confirmGoHome, goHome, isConfirmOpen } = useGoHome({
    meetingId,
  });
  const { data: midpoint, isLoading: isMidpointLoading } =
    useGetMidpointRecommendations({
      meetingId,
      ...LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS,
    });

  const recommendations = midpoint?.recommendations ?? [];
  const stationId = Number(searchParams.get(LOCATION_QUERY_PARAMS.stationId));

  const selectedStation = useMemo(() => {
    if (recommendations.length === 0) return null;

    return (
      recommendations.find((station) => station.stationId === stationId) ??
      recommendations.find((station) => station.rank === 1) ??
      recommendations[0]
    );
  }, [recommendations, stationId]);

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

  useEffect(() => {
    if (!mapInst) return;

    const points = [
      ...recommendations.map((station) => ({
        latitude: station.latitude,
        longitude: station.longitude,
      })),
      ...(departures ?? []).map((locationVote) => ({
        latitude: locationVote.departureLat,
        longitude: locationVote.departureLng,
      })),
    ];

    fitMapBounds({ mapInst, sheetHeight, points });
  }, [mapInst, sheetHeight, recommendations, departures]);

  /**
   * 시트를 끄는 동안 sheetHeight가 매 프레임 갱신되므로 deps에 넣지 않는다.
   * 넣으면 panTo 애니메이션이 프레임마다 다시 시작해 지도가 떨린다.
   * 시트 드래그로 인한 재프레이밍은 위의 fitMapBounds가 맡는다.
   */
  const sheetHeightRef = useRef(sheetHeight);

  useEffect(() => {
    sheetHeightRef.current = sheetHeight;
  }, [sheetHeight]);

  useEffect(() => {
    if (!mapInst || !selectedStation) return;

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

  const hasRecommendations = recommendations.length > 0;
  const departureCount = departures?.length ?? 0;
  const registeredCount = midpoint?.registeredCount ?? departureCount;
  const totalCount = midpoint?.totalCount ?? departureCount;
  const hasEnoughDepartures = registeredCount >= 2;
  const isInsufficientDepartures =
    !hasRecommendations && !midpoint?.noNearbyStations;
  const insufficientDepartureContent = isInsufficientDepartures
    ? getInsufficientDepartureContent({
        registeredCount,
        totalCount,
        hasMyDeparture: myInfo?.locationVoteId != null,
      })
    : null;
  const isNearbyDepartures = shouldShowNearbyDepartureNote({
    resultType: midpoint?.resultType,
    recommendations,
    departures: departures ?? [],
  });

  const handleStationClick = (stationId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.stationId, String(stationId));
    setSearchParams(next, { replace: true });
  };

  const handleMoveNearby = () => {
    if (!selectedStation) return;

    const coordsPath = toCoordsPath({
      latitude: selectedStation.latitude,
      longitude: selectedStation.longitude,
    });

    navigate(
      `/meetings/${meetingId}/location/nearby/${coordsPath}?${LOCATION_QUERY_PARAMS.stationId}=${selectedStation.stationId}`,
    );
  };

  const handleVoteAction = () => {
    if (insufficientDepartureContent?.primaryAction === "share") {
      share();
      return;
    }

    if (hasEnoughDepartures) {
      navigate(`/meetings/${meetingId}/location/votes`);
      return;
    }

    navigate(`/meetings/${meetingId}/location/votes/new`);
  };

  return (
    <>
      <HomeLogoButton className="absolute top-4 left-4" onClick={goHome} />

      {selectedStation && (
        <NearbyPlacesFloatingButton onClick={handleMoveNearby} />
      )}

      {recommendations.map((station) => (
        <MapMarker
          key={station.stationId}
          latitude={station.latitude}
          longitude={station.longitude}
          onClick={() => handleStationClick(station.stationId)}
          zIndex={station.stationId === selectedStation?.stationId ? 120 : 100}
        >
          <TextPin
            text={station.stationName}
            variant={
              station.stationId === selectedStation?.stationId
                ? "blue"
                : "black"
            }
          />
        </MapMarker>
      ))}

      {(departures ?? []).map((locationVote) => (
        <MapMarker
          key={locationVote.locationVoteId}
          latitude={locationVote.departureLat}
          longitude={locationVote.departureLng}
          zIndex={90}
        >
          <LogoPinIcon className="size-12" />
        </MapMarker>
      ))}

      <BottomSheet defaultSnap="half" onHeightChange={setSheetHeight}>
        {isMidpointLoading ? null : hasRecommendations && selectedStation ? (
          <div className="flex flex-col gap-4 px-5 pb-[106px]">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {recommendations.map((station) => (
                <ChipButton
                  key={station.stationId}
                  size="lg"
                  variant={
                    station.stationId === selectedStation.stationId
                      ? "midpointSelected"
                      : "midpoint"
                  }
                  onClick={() => handleStationClick(station.stationId)}
                >
                  {station.stationName}
                </ChipButton>
              ))}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-h2 text-k-800">
                  {selectedStation.stationName}
                </p>
                <p className="mt-0.5 text-h1 text-k-900">
                  평균{" "}
                  {formatDuration(
                    Math.round(selectedStation.avgTransitDuration),
                  )}
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-0.5 text-b2 text-k-500"
              >
                {formatDepartureDateTime(midpoint?.departureTime)}
                <ChevronDownIcon className="size-5 text-k-400" />
              </button>
            </div>

            <p className="text-b4 text-k-400">
              {selectedStation.line} · 중심에서{" "}
              {selectedStation.distanceFromCenter}m
            </p>

            {isNearbyDepartures && <NearbyDeparturesNote />}

            <p className="inline-flex items-center gap-1 text-b3 text-k-500">
              <MemberIcon className="size-4 text-k-500" />
              팀원 <span className="text-primary-main">{registeredCount}</span>/
              {totalCount}
            </p>

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
            <InsufficientDeparturesEmptyState
              content={
                insufficientDepartureContent ??
                getInsufficientDepartureContent({
                  registeredCount,
                  totalCount,
                  hasMyDeparture: myInfo?.locationVoteId != null,
                })
              }
              onAddDeparture={() =>
                navigate(`/meetings/${meetingId}/location/votes/new`)
              }
              onShare={share}
            />
          </div>
        )}
      </BottomSheet>

      <BottomActionBarWithButtonAndShare
        onClick={handleVoteAction}
        onShare={share}
        buttonVariant={insufficientDepartureContent ? "blue" : "white"}
        showShareButton={insufficientDepartureContent === null}
      >
        {insufficientDepartureContent?.primaryAction === "share"
          ? "초대 링크 공유하기"
          : hasEnoughDepartures
            ? "출발지 관리하기"
            : "출발지 추가하기"}
      </BottomActionBarWithButtonAndShare>

      <HomeExitConfirmModal
        isOpen={isConfirmOpen}
        onCancel={cancelGoHome}
        onConfirm={confirmGoHome}
      />
    </>
  );
}
