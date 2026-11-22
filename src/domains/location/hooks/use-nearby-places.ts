import { type Query, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  FoodCondition,
  NearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
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
 * 같은 역에서 분류나 식당 조건만 바꿨는지. 쿼리 키의 세 번째와 네 번째가 역 좌표다(getNearbyPlacesQueryKey).
 * 탭을 닫아 좌표가 NaN이 된 키는 어떤 좌표와도 같지 않다.
 */
function isSameStationKey(
  queryKey: readonly unknown[] | undefined,
  latitude: number,
  longitude: number,
) {
  return queryKey?.[2] === latitude && queryKey?.[3] === longitude;
}

/**
 * 역 주변 장소를 카카오 지도 SDK로 찾는다(#269).
 * 카카오 결과는 저장해 다시 쓰지 않으므로, 화면에서 쓰지 않게 되면 바로 버리고(gcTime 0)
 * 다시 쓸 때는 새로 부른다(staleTime 0). 식당 조건을 바꿀 때도 새로 부른다(#273).
 *
 * 같은 역에서 분류나 조건만 바꾸면 새 결과가 올 때까지 화면에 있던 결과를 그대로 둔다(isPlaceholderData, #275).
 * 예전에는 누를 때마다 핀과 카드가 모두 사라졌다가 다시 나타났다. 화면에 있던 것을 다음 결과가 올 때까지 두는
 * 것이라 저장하는 것은 아니다. 역을 바꾸면 다른 역 주변 장소가 남지 않게, 탭을 닫았다 열면 이미 버린 결과를 다시
 * 보이지 않게 지금처럼 비운다.
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
  const queryClient = useQueryClient();

  /**
   * 이전 결과는 같은 역의 결과이고 아직 버리지 않았을 때(이전 쿼리가 캐시에 그대로 있을 때)만 쓴다.
   * TanStack Query는 결과가 있던 마지막 쿼리를 따로 기억해 넘겨서, 탭을 닫아 버린 결과도 다시 열 때 넘어온다.
   * 함수를 고정해 두면 TanStack Query가 한 번 보인 이전 결과를 새 결과가 올 때까지 그대로 쓴다(그사이 버려져도).
   */
  const keepSameStationPlaces = useCallback(
    (
      previousData: NearbyPlace[] | undefined,
      previousQuery:
        | Query<
            NearbyPlace[],
            Error,
            NearbyPlace[],
            ReturnType<typeof getNearbyPlacesQueryKey>
          >
        | undefined,
    ) =>
      previousQuery &&
      isSameStationKey(previousQuery.queryKey, latitude, longitude) &&
      // 같은 키로 새로 만든 쿼리가 아니라 그 쿼리 객체 그대로인지 본다.
      Object.is(
        queryClient.getQueryCache().get(previousQuery.queryHash),
        previousQuery,
      )
        ? previousData
        : undefined,
    [latitude, longitude, queryClient],
  );

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
    placeholderData: keepSameStationPlaces,
  });
}
