import { useQuery } from "@tanstack/react-query";
import type { NearbyCategory } from "@/domains/location/constants/nearby-categories";
import { searchNearbyPlaces } from "@/domains/location/utils/search-nearby-places";

export function getNearbyPlacesQueryKey({
  latitude,
  longitude,
  category,
}: {
  latitude: number;
  longitude: number;
  category: NearbyCategory;
}) {
  return ["locations", "nearby-places", latitude, longitude, category] as const;
}

/**
 * 역 주변 장소를 카카오 지도 SDK로 찾는다(#269).
 * 카카오 결과는 저장해 다시 쓰지 않으므로, 화면에서 쓰지 않게 되면 바로 버리고(gcTime 0)
 * 다시 쓸 때는 새로 부른다(staleTime 0).
 */
export function useNearbyPlaces({
  latitude,
  longitude,
  category,
  enabled = true,
}: {
  latitude: number;
  longitude: number;
  category: NearbyCategory;
  enabled?: boolean;
}) {
  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

  return useQuery({
    queryKey: getNearbyPlacesQueryKey({ latitude, longitude, category }),
    queryFn: () => searchNearbyPlaces({ latitude, longitude, category }),
    enabled: enabled && hasCoords,
    staleTime: 0,
    gcTime: 0,
  });
}
