export const LOCATION_QUERY_PARAMS = {
  stationId: "station_id",
  routeTab: "tab",
  nearbyCategory: "category",
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
