import { Chip } from "@moyeorak/design-system";
import { useEffect, useMemo, useRef } from "react";
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
import {
  canManageDepartures,
  getInsufficientDepartureCopy,
} from "@/domains/location/utils/insufficient-departures";
import {
  getMapFitPadding,
  getVisibleCenterOffsetY,
} from "@/domains/location/utils/map-viewport";
import { shouldShowNearbyDepartureNote } from "@/domains/location/utils/midpoint-result";
import { hasVoteId } from "@/domains/meeting/utils/vote-id";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";
import { FixedBottomArea } from "@/shared/components/fixed-bottom-area";
import { ChevronDownIcon, LogoPinIcon } from "@/shared/components/icons";
import { ParticipantCount } from "@/shared/components/participant-count";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { useShareSheet } from "@/shared/hooks/use-share-sheet";
import { attachRevealFocusedChip } from "@/shared/utils/reveal-in-scroller";

/** 점이 하나일 때의 확대 단계. 핀 옆 역 이름과 동 이름이 읽히는 정도다. */
const SINGLE_POINT_ZOOM = 15;

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
    return;
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
  if (!padding) return;

  mapInst.fitBounds(bounds, padding);
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
   * sheetHeight를 deps에 넣지 않는다. 넣으면 스냅이 바뀔 때마다 panTo가
   * 다시 돌아, 시트만 올렸는데 지도가 따라 움직인다. 시트 높이에 맞춘
   * 재프레이밍은 위의 fitMapBounds가 맡는다.
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

  /**
   * myInfo가 오기 전에는 hasMyDeparture가 false라, 이미 등록한 사람에게도
   * "출발지 추가하기"가 잠깐 떴다가 "출발지 관리하기"로 바뀐다. 문구와 하단
   * 버튼이 둘 다 이 값에 기대므로 midpoint와 함께 기다렸다가 한 번에 그린다.
   */
  const isContentLoading = isMidpointLoading || isMyInfoLoading;
  const hasRecommendations = recommendations.length > 0;
  const departureCount = departures?.length ?? 0;
  const registeredCount = midpoint?.registeredCount ?? departureCount;
  const totalCount = midpoint?.totalCount ?? departureCount;
  const hasMyDeparture = hasVoteId(myInfo?.locationVoteId);
  const shouldManageDepartures = canManageDepartures({
    registeredCount,
    hasMyDeparture,
  });
  const insufficientDepartureCopy = getInsufficientDepartureCopy({
    registeredCount,
    hasMyDeparture,
  });
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
    if (shouldManageDepartures) {
      navigate(`/meetings/${meetingId}/location/votes`);
      return;
    }

    navigate(`/meetings/${meetingId}/location/votes/new`);
  };

  return (
    <>
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
        {isContentLoading ? null : hasRecommendations && selectedStation ? (
          <div className="flex flex-col gap-4 px-5 pt-1 pb-[106px]">
            {/* 스크롤 영역에 포커스 링(두께 2px, 간격 2px)이 들어갈 4px를 둔다. 위, 아래, 왼쪽은 음수 margin으로 되돌려 칩 위치를 그대로 두고, 오른쪽은 되돌리지 않아 평소에 잘리는 위치도 그대로 둔다. 시트 스크롤 영역도 링 위쪽을 잘라서, 감싸는 div의 pt-1로 칩 줄을 시트 맨 위에서 4px 띄운다. */}
            <div
              className="scrollbar-hide -my-1 -ml-1 flex gap-2 overflow-x-auto p-1"
              ref={attachRevealFocusedChip}
            >
              {recommendations.map((station) => (
                <Chip
                  key={station.stationId}
                  shape="pill"
                  pressed={station.stationId === selectedStation.stationId}
                  variant={
                    station.stationId === selectedStation.stationId
                      ? "brand"
                      : "neutral-weak"
                  }
                  className="shrink-0"
                  onClick={() => handleStationClick(station.stationId)}
                >
                  {station.stationName}
                </Chip>
              ))}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="textStyle_head3 text-fg-neutral-strong">
                  {selectedStation.stationName}
                </p>
                <p className="textStyle_head1 mt-0.5 text-fg-neutral-stronger">
                  평균{" "}
                  {formatDuration(
                    Math.round(selectedStation.avgTransitDuration),
                  )}
                </p>
              </div>

              <button
                type="button"
                className="textStyle_body2 inline-flex items-center gap-0.5 text-fg-neutral-subtle"
              >
                {formatDepartureDateTime(midpoint?.departureTime)}
                <ChevronDownIcon className="size-5 text-fg-neutral-subtler" />
              </button>
            </div>

            <p className="textStyle_body4 text-fg-neutral-subtler">
              {selectedStation.line}, 중심에서{" "}
              {selectedStation.distanceFromCenter}m
            </p>

            {isNearbyDepartures && <NearbyDeparturesNote />}

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
