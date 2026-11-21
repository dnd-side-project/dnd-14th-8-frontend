// 주변 살펴보기의 장소를 카카오 지도 SDK(index.html에서 불러 둔 services 라이브러리)로 바로 찾는다.
// 카카오는 장소 이름, 주소, 좌표를 저장해 다시 쓰는 것을 허용하지 않아, 칩을 고를 때마다 새로 부르고 저장하지 않는다.
// 백엔드를 거치지 않는 이유와 실측은 #269 Background에 있다.
import {
  NEARBY_SEARCH_RADIUS_METERS,
  NEARBY_SEARCH_RULES,
  NEARBY_SEARCH_SIZE,
  type NearbyCategory,
} from "@/domains/location/constants/nearby-categories";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";

interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  /** x, y를 넘겼을 때만 온다(단위 m) */
  distance: string;
  place_url: string;
}

interface KakaoPlacesSearchOptions {
  x: number;
  y: number;
  radius: number;
  size: number;
  sort: string;
  category_group_code?: string;
}

type KakaoPlacesCallback = (data: KakaoPlaceDocument[], status: string) => void;

interface KakaoPlacesServices {
  Places: new () => {
    keywordSearch: (
      keyword: string,
      callback: KakaoPlacesCallback,
      options: KakaoPlacesSearchOptions,
    ) => void;
    categorySearch: (
      code: string,
      callback: KakaoPlacesCallback,
      options: KakaoPlacesSearchOptions,
    ) => void;
  };
  Status: { OK: string; ZERO_RESULT: string };
  SortBy: { ACCURACY: string; DISTANCE: string };
}

function getKakaoPlacesServices() {
  return (
    window.kakao as { maps?: { services?: KakaoPlacesServices } } | undefined
  )?.maps?.services;
}

export function toNearbyPlace(document: KakaoPlaceDocument): NearbyPlace {
  return {
    id: document.id,
    name: document.place_name,
    address: document.road_address_name || document.address_name,
    distanceMeters: Number(document.distance),
    latitude: Number(document.y),
    longitude: Number(document.x),
    placeUrl: document.place_url,
  };
}

export interface SearchNearbyPlacesParams {
  /** 기준이 되는 역의 좌표 */
  latitude: number;
  longitude: number;
  category: NearbyCategory;
}

/** 결과가 없으면 빈 배열, SDK가 없거나 카카오가 실패를 알리면 오류로 끝난다. */
export function searchNearbyPlaces({
  latitude,
  longitude,
  category,
}: SearchNearbyPlacesParams): Promise<NearbyPlace[]> {
  const services = getKakaoPlacesServices();
  if (!services) return Promise.reject(new Error("KAKAO_SDK_NOT_LOADED"));

  const rule = NEARBY_SEARCH_RULES[category];
  const options: KakaoPlacesSearchOptions = {
    x: longitude,
    y: latitude,
    radius: NEARBY_SEARCH_RADIUS_METERS,
    size: NEARBY_SEARCH_SIZE,
    sort:
      rule.sort === "accuracy"
        ? services.SortBy.ACCURACY
        : services.SortBy.DISTANCE,
    ...(rule.categoryGroupCode
      ? { category_group_code: rule.categoryGroupCode }
      : {}),
  };

  return new Promise((resolve, reject) => {
    const callback: KakaoPlacesCallback = (data, status) => {
      if (status === services.Status.OK) {
        resolve(data.map(toNearbyPlace));
      } else if (status === services.Status.ZERO_RESULT) {
        resolve([]);
      } else {
        reject(new Error("KAKAO_SERVICES_ERROR"));
      }
    };

    const places = new services.Places();
    if (rule.keyword) {
      places.keywordSearch(rule.keyword, callback, options);
    } else if (rule.categoryGroupCode) {
      places.categorySearch(rule.categoryGroupCode, callback, options);
    }
  });
}
