import { useEffect, useMemo } from "react";
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
import { ButtonBottom } from "@/shared/components/button-bottom";

function categoryToFacilityType(category: string): FacilityType {
  if (category.includes("카페")) return "cafe";
  if (category.includes("식당")) return "restaurant";
  if (category.includes("회의")) return "meetingroom";
  return "book";
}

export function PlaceDetailPage() {
  const navigate = useNavigate();
  const { meetingId = "", coords = "", placeId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { mapInst, sheetHeight, setSheetHeight } =
    useOutletContext<MapPageOutletContext>();

  const parsedCoords = parseCoordsPath(coords);
  const parsedLatitude = parsedCoords?.latitude ?? Number.NaN;
  const parsedLongitude = parsedCoords?.longitude ?? Number.NaN;
  const coordsPath = parsedCoords ? toCoordsPath(parsedCoords) : coords;

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

  const placeCategoryGroup = useMemo(
    () =>
      nearbyResponse?.categories.find((categoryPlaces) =>
        categoryPlaces.places.some((place) => place.id === Number(placeId)),
      ) ?? null,
    [nearbyResponse, placeId],
  );

  const selectedPlace =
    placeCategoryGroup?.places.find((place) => place.id === Number(placeId)) ??
    null;

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

    mapInst.fitBounds(bounds, {
      top: 80,
      bottom: Math.max(sheetHeight + 20, 140),
      left: 20,
      right: 20,
    });
  }, [mapInst, selectedPlace, selectedStation, sheetHeight]);

  const selectedCategory = placeCategoryGroup?.category ?? "";
  const facilityType = categoryToFacilityType(selectedCategory);

  return (
    <>
      <StationBadges
        recommendations={recommendations}
        selectedStationId={selectedStation?.stationId}
        onBack={() => navigate(-1)}
        onStationClick={(station) => {
          const next = new URLSearchParams(searchParams);
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

      {placeCategoryGroup?.places.map((place) => (
        <MapMarker
          key={place.id}
          latitude={place.latitude}
          longitude={place.longitude}
          zIndex={place.id === Number(placeId) ? 130 : 110}
        >
          {place.id === Number(placeId) ? (
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
          {selectedPlace ? (
            <>
              <CardFacility
                name={selectedPlace.name}
                distanceFromBase={selectedPlace.distanceFromBase}
                isOpen={selectedPlace.isOpen}
                businessStatusMessage={selectedPlace.businessStatusMessage}
                disabled
                className="border-none px-0 py-0"
              />

              <ButtonBottom
                variant="black"
                onClick={() =>
                  window.open(selectedPlace.kakaoPlaceUrl, "_blank")
                }
              >
                자세히 보기
              </ButtonBottom>
            </>
          ) : (
            <>
              <p className="text-center text-b2 text-k-600">
                요청한 장소 정보를 찾을 수 없어요
              </p>
              <ButtonBottom
                variant="black"
                onClick={() =>
                  navigate(
                    `/meetings/${meetingId}/location/nearby/${coordsPath}?${searchParams.toString()}`,
                  )
                }
              >
                주변 장소 목록으로
              </ButtonBottom>
            </>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
