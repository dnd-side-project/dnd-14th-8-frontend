/**
 * 주변 살펴보기의 장소 하나. 카카오 지도 SDK 검색 결과를 화면에서 쓰는 모양으로 바꾼 것이다.
 * 카카오는 장소 이름, 주소, 좌표를 저장해 다시 쓰는 것을 허용하지 않아 어디에도 저장하지 않는다(#269).
 */
export interface NearbyPlace {
  /** 카카오 장소 ID. 고른 장소를 결과 화면 주소의 place_id로 남길 때 쓴다(#271) */
  id: string;
  name: string;
  /** 도로명 주소. 없으면 지번 주소 */
  address: string;
  /** 역 좌표에서 거리(m) */
  distanceMeters: number;
  latitude: number;
  longitude: number;
  /** 카카오맵 장소 페이지 */
  placeUrl: string;
}
