import { useQuery } from "@tanstack/react-query";
import type {
  FoodCondition,
  NearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import { searchNearbyPlaces } from "@/domains/location/utils/search-nearby-places";

/**
 * 식당은 조건(#273)마다 결과가 달라 키에 조건을 넣는다. 다른 분류는 조건을 쓰지 않아 null로 둔다
 * (주소에 condition이 남아 있어도 같은 키다).
 */
export function getNearbyPlacesQueryKey({
  latitude,
  longitude,
  category,
  foodCondition = "nearest",
}: {
  latitude: number;
  longitude: number;
  category: NearbyCategory;
  foodCondition?: FoodCondition;
}) {
  return [
    "locations",
    "nearby-places",
    latitude,
    longitude,
    category,
    category === "식당" ? foodCondition : null,
  ] as const;
}

/**
 * 역 주변 장소를 카카오 지도 SDK로 찾는다(#269).
 * 카카오 결과는 저장해 다시 쓰지 않으므로, 화면에서 쓰지 않게 되면 바로 버리고(gcTime 0)
 * 다시 쓸 때는 새로 부른다(staleTime 0). 식당 조건을 바꿀 때도 새로 부른다(#273).
 */
export function useNearbyPlaces({
  latitude,
  longitude,
  category,
  foodCondition = "nearest",
  enabled = true,
}: {
  latitude: number;
  longitude: number;
  category: NearbyCategory;
  foodCondition?: FoodCondition;
  enabled?: boolean;
}) {
  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

  return useQuery({
    queryKey: getNearbyPlacesQueryKey({
      latitude,
      longitude,
      category,
      foodCondition,
    }),
    queryFn: () =>
      searchNearbyPlaces({
        latitude,
        longitude,
        category,
        ...(category === "식당" ? { foodCondition } : {}),
      }),
    enabled: enabled && hasCoords,
    staleTime: 0,
    gcTime: 0,
  });
}
