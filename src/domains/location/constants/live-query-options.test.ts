import { describe, expect, it } from "vitest";
import {
  LOCATION_DEPARTURE_LIST_LIVE_QUERY_OPTIONS,
  LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS,
} from "@/domains/location/constants/live-query-options";

describe("location live query options", () => {
  it("출발지 관리 화면은 5초 주기로 최신 출발지를 다시 조회한다", () => {
    expect(LOCATION_DEPARTURE_LIST_LIVE_QUERY_OPTIONS).toEqual({
      refetchInterval: 5 * 1000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    });
  });

  it("중간지점 결과 화면은 10초 주기로 출발지와 추천 결과를 다시 조회한다", () => {
    expect(LOCATION_MIDPOINT_RESULT_LIVE_QUERY_OPTIONS).toEqual({
      refetchInterval: 10 * 1000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    });
  });
});
