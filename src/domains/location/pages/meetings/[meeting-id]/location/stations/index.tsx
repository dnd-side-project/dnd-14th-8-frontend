import { useEffect, useMemo } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router";
import PlaceholderGraphic from "@/assets/graphic/placeholder.svg?react";
import { BottomSheet } from "@/domains/location/components/bottom-sheet";
import { CardLocationMember } from "@/domains/location/components/card-location-member";
import { MapMarker } from "@/domains/location/components/map-marker";
import { TextPin } from "@/domains/location/components/text-pin";
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
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";
import { ChipButton } from "@/shared/components/chip-button";
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

export function LocationMainPage() {
  const navigate = useNavigate();
  const { share } = useShareSheet();
  const { meetingId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight } =
    useOutletContext<MapPageOutletContext>();

  const { data: departures } = useGetDepartures({ meetingId });
  const { data: midpoint, isLoading: isMidpointLoading } =
    useGetMidpointRecommendations({
      meetingId,
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

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !selectedStation || !maps) return;

    mapInst.panTo(
      new maps.LatLng(selectedStation.latitude, selectedStation.longitude),
    );
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

  const handleStationClick = (stationId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.stationId, String(stationId));
    setSearchParams(next);
  };

  const handleMoveNearby = () => {
    if (!selectedStation) return;

    const coordsPath = toCoordsPath({
      latitude: selectedStation.latitude,
      longitude: selectedStation.longitude,
    });

    window.location.assign(
      `/meetings/${meetingId}/location/nearby/${coordsPath}?${LOCATION_QUERY_PARAMS.stationId}=${selectedStation.stationId}`,
    );
  };

  const handleVoteAction = () => {
    if (hasEnoughDepartures) {
      navigate(`/meetings/${meetingId}/location/votes`);
      return;
    }

    navigate(`/meetings/${meetingId}/location/votes/new`);
  };

  return (
    <>
      {selectedStation && (
        <button
          type="button"
          className="absolute top-3 right-5 z-30 rounded-full bg-k-5 px-3 py-2 text-b4 text-k-700 shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
          onClick={handleMoveNearby}
        >
          주변 <span className="text-primary-main underline">둘러보기</span>
        </button>
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

            <p className="inline-flex items-center gap-1 text-b3 text-k-500">
              <MemberIcon className="size-4 text-k-500" />
              참여자{" "}
              <span className="text-primary-main">{registeredCount}</span>/
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
        ) : (
          <div className="flex min-h-full flex-col px-5 pb-[106px]">
            <PlaceholderContent
              graphic={<PlaceholderGraphic className="h-[90px] w-[104px]" />}
              title="출발지가 아직 충분하지 않아요"
              description={`${registeredCount}명 등록됨 · 최소 2명 이상 출발지를 등록하면 중간지점을 추천해드려요`}
            />
          </div>
        )}
      </BottomSheet>

      <BottomActionBarWithButtonAndShare
        onClick={handleVoteAction}
        onShare={share}
      >
        {hasEnoughDepartures ? "출발지 관리하기" : "출발지 추가하기"}
      </BottomActionBarWithButtonAndShare>
    </>
  );
}
