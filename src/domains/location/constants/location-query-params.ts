export const LOCATION_QUERY_PARAMS = {
  stationId: "station_id",
  routeTab: "tab",
  nearbyCategory: "category",
  /** 결과 화면의 탭(개인별 루트, 주변 살펴보기). 개인 루트 화면의 routeTab과 같은 이름이지만 다른 화면이다 */
  resultTab: "tab",
} as const;

export const ROUTE_TAB_VALUES = {
  transit: "transit",
  driving: "driving",
} as const;

export type RouteTab = (typeof ROUTE_TAB_VALUES)[keyof typeof ROUTE_TAB_VALUES];

export function parseRouteTab(value: string | null): RouteTab {
  return value === ROUTE_TAB_VALUES.driving
    ? ROUTE_TAB_VALUES.driving
    : ROUTE_TAB_VALUES.transit;
}

/** 결과 화면 시트의 탭(#269). 값이 없으면 개인별 루트다 */
export const RESULT_TAB_VALUES = {
  routes: "routes",
  nearby: "nearby",
} as const;

export type ResultTab =
  (typeof RESULT_TAB_VALUES)[keyof typeof RESULT_TAB_VALUES];

export function parseResultTab(value: string | null): ResultTab {
  return value === RESULT_TAB_VALUES.nearby
    ? RESULT_TAB_VALUES.nearby
    : RESULT_TAB_VALUES.routes;
}
