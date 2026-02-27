import { useEffect, useMemo } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router";
import { BottomSheet } from "@/domains/location/components/bottom-sheet";
import { CardTraffic } from "@/domains/location/components/card-traffic";
import { MapMarker } from "@/domains/location/components/map-marker";
import { Marker } from "@/domains/location/components/marker";
import { StationBadges } from "@/domains/location/components/station-badges";
import { TextPin } from "@/domains/location/components/text-pin";
import {
  LOCATION_QUERY_PARAMS,
  parseRouteTab,
  ROUTE_TAB_VALUES,
} from "@/domains/location/constants/location-query-params";
import { useGetDepartures } from "@/domains/location/hooks/use-get-departures";
import { useGetMidpointRecommendations } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { useGetPersonalRoute } from "@/domains/location/hooks/use-get-personal-route";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import { formatDepartureDateTime } from "@/domains/location/utils/format";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { ChipButton } from "@/shared/components/chip-button";
import {
  CarIcon,
  ChevronDownIcon,
  TrafficIcon,
} from "@/shared/components/icons";
import { Tab } from "@/shared/components/tab";

function formatWon(value: number) {
  return `약 ${value.toLocaleString()}원`;
}

export function RouteDetailPage() {
  const navigate = useNavigate();
  const { meetingId = "", stationId = "", participantId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight } =
    useOutletContext<MapPageOutletContext>();

  const { data: departures } = useGetDepartures({ meetingId });
  const { data: midpoint } = useGetMidpointRecommendations({ meetingId });
  const { data: personalRoute, isLoading } = useGetPersonalRoute({
    meetingId,
    stationId: Number(stationId),
    participantId: Number(participantId),
    mode: "both",
  });

  const recommendations = midpoint?.recommendations ?? [];
  const requestedTab = parseRouteTab(
    searchParams.get(LOCATION_QUERY_PARAMS.routeTab),
  );
  const transit = personalRoute?.transit;
  const driving = personalRoute?.driving;

  const activeTab =
    requestedTab === ROUTE_TAB_VALUES.driving
      ? driving
        ? ROUTE_TAB_VALUES.driving
        : transit
          ? ROUTE_TAB_VALUES.transit
          : ROUTE_TAB_VALUES.driving
      : transit
        ? ROUTE_TAB_VALUES.transit
        : driving
          ? ROUTE_TAB_VALUES.driving
          : ROUTE_TAB_VALUES.transit;

  useEffect(() => {
    const currentTab = searchParams.get(LOCATION_QUERY_PARAMS.routeTab);
    if (currentTab === activeTab) return;

    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.routeTab, activeTab);
    setSearchParams(next, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  const selectedStation = useMemo(
    () =>
      recommendations.find(
        (station) => station.stationId === Number(stationId),
      ) ??
      recommendations.find((station) => station.rank === 1) ??
      recommendations[0] ??
      null,
    [recommendations, stationId],
  );

  const selectedDeparture = useMemo(() => {
    const participantName = personalRoute?.participant.participantName;
    if (!participantName) return null;

    return (
      departures?.find(
        (locationVote) => locationVote.participantName === participantName,
      ) ?? null
    );
  }, [departures, personalRoute]);

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !selectedStation || !selectedDeparture || !maps) return;

    const stationLatLng = new maps.LatLng(
      selectedStation.latitude,
      selectedStation.longitude,
    );
    const departureLatLng = new maps.LatLng(
      selectedDeparture.departureLat,
      selectedDeparture.departureLng,
    );
    const bounds = new maps.LatLngBounds(stationLatLng, departureLatLng);

    mapInst.fitBounds(bounds, {
      top: 80,
      bottom: Math.max(sheetHeight + 20, 140),
      left: 20,
      right: 20,
    });
  }, [mapInst, selectedStation, selectedDeparture, sheetHeight]);

  return (
    <>
      <StationBadges
        recommendations={recommendations}
        selectedStationId={selectedStation?.stationId}
        onBack={() => navigate(-1)}
        onStationClick={(station) => {
          navigate(
            `/meetings/${meetingId}/location/stations/${station.stationId}/participants/${participantId}?${LOCATION_QUERY_PARAMS.routeTab}=${activeTab}`,
          );
        }}
      />

      {recommendations.map((station) => (
        <MapMarker
          key={station.stationId}
          latitude={station.latitude}
          longitude={station.longitude}
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

      {selectedDeparture && personalRoute && (
        <MapMarker
          latitude={selectedDeparture.departureLat}
          longitude={selectedDeparture.departureLng}
          zIndex={130}
        >
          <Marker
            text={personalRoute.participant.participantName}
            variant="blue"
            size="sm"
          />
        </MapMarker>
      )}

      <BottomSheet defaultSnap="half" onHeightChange={setSheetHeight}>
        {isLoading ? null : personalRoute ? (
          <div className="flex flex-col gap-4 px-5 pb-[106px]">
            <h2 className="text-h1 text-k-900">
              {personalRoute.participant.participantName}님의 루트
            </h2>

            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {recommendations.map((station) => (
                <ChipButton
                  key={station.stationId}
                  size="lg"
                  variant={
                    station.stationId === selectedStation?.stationId
                      ? "midpointSelected"
                      : "midpoint"
                  }
                  onClick={() =>
                    navigate(
                      `/meetings/${meetingId}/location/stations/${station.stationId}/participants/${participantId}?${LOCATION_QUERY_PARAMS.routeTab}=${activeTab}`,
                    )
                  }
                >
                  {station.stationName}
                </ChipButton>
              ))}
            </div>

            <Tab
              tabs={[
                { id: "transit", label: "대중교통", icon: TrafficIcon },
                { id: "driving", label: "자동차", icon: CarIcon },
              ]}
              activeTabId={activeTab}
              onTabChange={(tabId) => {
                if (tabId === ROUTE_TAB_VALUES.driving && !driving) return;
                if (tabId === ROUTE_TAB_VALUES.transit && !transit) return;

                const next = new URLSearchParams(searchParams);
                next.set(
                  LOCATION_QUERY_PARAMS.routeTab,
                  tabId === ROUTE_TAB_VALUES.driving
                    ? ROUTE_TAB_VALUES.driving
                    : ROUTE_TAB_VALUES.transit,
                );
                setSearchParams(next);
              }}
            />

            <button
              type="button"
              className="inline-flex w-fit items-center gap-0.5 text-b2 text-k-500"
            >
              {formatDepartureDateTime(personalRoute.departureTime)}
              <ChevronDownIcon className="size-5 text-k-400" />
            </button>

            {activeTab === ROUTE_TAB_VALUES.transit && transit && (
              <CardTraffic
                departure={personalRoute.participant.departureAddress}
                arrival={personalRoute.station.stationName}
                distanceMeters={transit.distanceMeters}
                durationMinutes={transit.durationMinutes}
                trafficGuides={[
                  { label: "요금", value: formatWon(transit.fare) },
                  { label: "환승", value: `${transit.transferCount}회` },
                ]}
              />
            )}

            {activeTab === ROUTE_TAB_VALUES.driving && driving && (
              <CardTraffic
                departure={personalRoute.participant.departureAddress}
                arrival={personalRoute.station.stationName}
                distanceMeters={driving.distanceMeters}
                durationMinutes={driving.durationMinutes}
                trafficGuides={[
                  {
                    label: "택시비",
                    value: formatWon(driving.estimatedTaxiFare),
                  },
                  { label: "통행료", value: formatWon(driving.tollFare) },
                ]}
              />
            )}

            <ButtonBottom
              variant="black"
              onClick={() =>
                navigate(
                  `/meetings/${meetingId}/location/stations?${LOCATION_QUERY_PARAMS.stationId}=${personalRoute.station.stationId}`,
                )
              }
            >
              지도에서 보기
            </ButtonBottom>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-5 pb-[106px]">
            <p className="text-center text-b2 text-k-600">
              루트 정보를 찾을 수 없어요
            </p>
            <ButtonBottom
              variant="black"
              onClick={() =>
                navigate(
                  `/meetings/${meetingId}/location/stations?${LOCATION_QUERY_PARAMS.stationId}=${stationId}`,
                )
              }
            >
              추천역 목록으로 돌아가기
            </ButtonBottom>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
