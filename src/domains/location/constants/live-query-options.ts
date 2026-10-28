export interface LocationLiveQueryOptions {
  refetchInterval?: false | number;
  refetchOnReconnect?: boolean;
  refetchOnWindowFocus?: boolean;
}

export const LOCATION_DEPARTURE_LIST_LIVE_QUERY_OPTIONS = {
  refetchInterval: 5 * 1000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
} satisfies LocationLiveQueryOptions;

export const LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS = {
  refetchInterval: 10 * 1000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
} satisfies LocationLiveQueryOptions;
