import type { PlaceItem } from "@/domains/location/utils/search-places";

export interface PlaceSelection {
  /** 출발지 칸 첫 줄이자 서버의 departureLocation */
  departureLocation: string;
  /** 출발지 칸 둘째 줄이자 서버의 departureAddress. 주소로 고르면 없다 */
  departureAddress?: string;
}

// 검색 결과를 고르면 장소 이름과 고를 때 본 주소를 함께 저장한다.
// 주소를 나중에 좌표로 다시 찾으면 표기나 건물이 달라질 수 있어서다(#230).
// 주소 검색 결과(#240)는 첫 줄이 이미 주소라 둘째 줄을 두지 않는다.
export function getPlaceSelection(item: PlaceItem): PlaceSelection {
  if (item.kind === "address") {
    return { departureLocation: item.title };
  }

  return {
    departureLocation: item.title,
    departureAddress: item.roadAddress || item.address,
  };
}
