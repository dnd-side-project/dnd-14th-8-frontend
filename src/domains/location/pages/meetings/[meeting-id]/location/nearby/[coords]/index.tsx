import { useEffect } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router";
import { BottomSheet } from "@/domains/location/components/bottom-sheet";
import { CardFacility } from "@/domains/location/components/card-facility";
import { ChipButtonWithIcon } from "@/domains/location/components/chip-button-with-icon";
import {
  FacilityPinDefault,
  type FacilityType,
} from "@/domains/location/components/facility-pin";
import { MapMarker } from "@/domains/location/components/map-marker";
import { StationBadges } from "@/domains/location/components/station-badges";
import { TextPin } from "@/domains/location/components/text-pin";
import { LOCATION_QUERY_PARAMS } from "@/domains/location/constants/location-query-params";
import { useGetMidpointRecommendations } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { useNearbyPlaceSearch } from "@/domains/location/hooks/use-nearby-place-search";
import type { MapPageOutletContext } from "@/domains/location/pages/meetings/[meeting-id]/location";
import { parseCoordsPath, toCoordsPath } from "@/domains/location/utils/coords";
import {
  BookIcon,
  CafeIcon,
  MeetingRoomIcon,
  RestaurantIcon,
} from "@/shared/components/icons";

function categoryToFacilityType(category: string): FacilityType {
  if (category.includes("카페")) return "cafe";
  if (category.includes("식당")) return "restaurant";
  if (category.includes("회의")) return "meetingroom";
  return "book";
}

function categoryToIcon(category: string) {
  if (category.includes("카페")) return <CafeIcon className="size-5" />;
  if (category.includes("식당")) return <RestaurantIcon className="size-5" />;
  if (category.includes("회의")) return <MeetingRoomIcon className="size-5" />;
  return <BookIcon className="size-5" />;
}

export function NearbySearchPage() {
  const navigate = useNavigate();
  const { meetingId = "", coords = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight } =
    useOutletContext<MapPageOutletContext>();

  const parsedCoords = parseCoordsPath(coords);
  const parsedLatitude = parsedCoords?.latitude ?? Number.NaN;
  const parsedLongitude = parsedCoords?.longitude ?? Number.NaN;
  const normalizedCoords = parsedCoords ? toCoordsPath(parsedCoords) : coords;

  const { data: midpoint } = useGetMidpointRecommendations({ meetingId });
  const { data: nearbyResponse } = useNearbyPlaceSearch({
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  });

  const recommendations = midpoint?.recommendations ?? [];
  const stationId = Number(searchParams.get(LOCATION_QUERY_PARAMS.stationId));
  const selectedStation =
    recommendations.find((station) => station.stationId === stationId) ??
    recommendations.find((station) => station.rank === 1) ??
    recommendations[0] ??
    null;

  const categoryPlacesList = nearbyResponse?.categories ?? [];
  const selectedCategory =
    searchParams.get(LOCATION_QUERY_PARAMS.nearbyCategory) ??
    categoryPlacesList[0]?.category;

  const selectedPlaces =
    categoryPlacesList.find(
      (categoryPlaces) => categoryPlaces.category === selectedCategory,
    )?.places ?? [];

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
    if (!selectedCategory) return;

    const current = searchParams.get(LOCATION_QUERY_PARAMS.nearbyCategory);
    if (current === selectedCategory) return;

    const next = new URLSearchParams(searchParams);
    next.set(LOCATION_QUERY_PARAMS.nearbyCategory, selectedCategory);
    setSearchParams(next, { replace: true });
  }, [searchParams, selectedCategory, setSearchParams]);

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !maps) return;

    const points = [
      ...(selectedStation
        ? [
            {
              latitude: selectedStation.latitude,
              longitude: selectedStation.longitude,
            },
          ]
        : []),
      ...selectedPlaces.map((place) => ({
        latitude: place.latitude,
        longitude: place.longitude,
      })),
    ];

    if (points.length === 0) return;

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
  }, [mapInst, selectedStation, selectedPlaces, sheetHeight]);

  return (
    <>
      <StationBadges
        recommendations={recommendations}
        selectedStationId={selectedStation?.stationId}
        onBack={() => navigate(-1)}
        onStationClick={(station) => {
          const next = new URLSearchParams(searchParams);
          if (selectedCategory) {
            next.set(LOCATION_QUERY_PARAMS.nearbyCategory, selectedCategory);
          }
          next.set(LOCATION_QUERY_PARAMS.stationId, String(station.stationId));

          const stationCoordsPath = toCoordsPath({
            latitude: station.latitude,
            longitude: station.longitude,
          });

          navigate(
            `/meetings/${meetingId}/location/nearby/${stationCoordsPath}?${next.toString()}`,
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

      {selectedPlaces.map((place) => (
        <MapMarker
          key={place.id}
          latitude={place.latitude}
          longitude={place.longitude}
          onClick={() =>
            window.location.assign(
              `/meetings/${meetingId}/location/nearby/${normalizedCoords}/places/${place.id}?${searchParams.toString()}`,
            )
          }
          zIndex={110}
        >
          <FacilityPinDefault
            type={categoryToFacilityType(selectedCategory ?? "")}
          />
        </MapMarker>
      ))}

      <BottomSheet defaultSnap="half" onHeightChange={setSheetHeight}>
        <div className="flex flex-col gap-4 px-5 pb-6">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {categoryPlacesList.map((categoryPlaces) => (
              <ChipButtonWithIcon
                key={categoryPlaces.category}
                icon={categoryToIcon(categoryPlaces.category)}
                status={
                  categoryPlaces.category === selectedCategory
                    ? "selected"
                    : "unselected"
                }
                shadow="on"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set(
                    LOCATION_QUERY_PARAMS.nearbyCategory,
                    categoryPlaces.category,
                  );
                  setSearchParams(next);
                }}
              >
                {categoryPlaces.category}
              </ChipButtonWithIcon>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {selectedPlaces.map((place) => (
              <CardFacility
                key={place.id}
                name={place.name}
                distanceFromBase={place.distanceFromBase}
                isOpen={place.isOpen}
                businessStatusMessage={place.businessStatusMessage}
                onClick={() =>
                  window.location.assign(
                    `/meetings/${meetingId}/location/nearby/${normalizedCoords}/places/${place.id}?${searchParams.toString()}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
