import { useQuery } from "@tanstack/react-query";
import { nearbyPlaceSearch } from "@/domains/location/apis/location-api";
import type { CoordinateValue } from "@/domains/location/types/location-api-types";

export function getNearbyPlaceSearchQueryKey({
  latitude,
  longitude,
}: {
  latitude: CoordinateValue;
  longitude: CoordinateValue;
}) {
  return ["locations", "nearby-place-search", latitude, longitude];
}

export function useNearbyPlaceSearch({
  latitude,
  longitude,
}: {
  latitude: CoordinateValue;
  longitude: CoordinateValue;
}) {
  const isLatitudeValid =
    typeof latitude === "number" ? Number.isFinite(latitude) : latitude !== "";
  const isLongitudeValid =
    typeof longitude === "number"
      ? Number.isFinite(longitude)
      : longitude !== "";

  return useQuery({
    queryKey: getNearbyPlaceSearchQueryKey({ latitude, longitude }),
    queryFn: async () => {
      const { data } = await nearbyPlaceSearch({ latitude, longitude });
      return data.data;
    },
    enabled: isLatitudeValid && isLongitudeValid,
    staleTime: 30 * 1000,
  });
}
