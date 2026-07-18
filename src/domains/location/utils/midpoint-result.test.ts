import { describe, expect, it } from "vitest";
import type {
  LocationVote,
  StationRecommendationDto,
} from "@/domains/location/types/location-api-types";
import { isNearbyDepartureResult } from "@/domains/location/utils/midpoint-result";

function createRecommendation(
  overrides: Partial<StationRecommendationDto>,
): StationRecommendationDto {
  return {
    avgTransitDuration: 10,
    distanceFromCenter: 100,
    latitude: 37.5,
    line: "2호선",
    longitude: 127,
    rank: 1,
    routes: [
      {
        departureAddress: "합정역",
        departureName: "참가자A",
        drivingDistance: 1500,
        drivingDuration: 8,
        drivingReachable: true,
        participantId: 1,
        transitDistance: 1000,
        transitDuration: 8,
        transitReachable: true,
      },
      {
        departureAddress: "홍대입구역",
        departureName: "참가자B",
        drivingDistance: 1300,
        drivingDuration: 7,
        drivingReachable: true,
        participantId: 2,
        transitDistance: 900,
        transitDuration: 9,
        transitReachable: true,
      },
    ],
    stationId: 1,
    stationName: "합정역",
    ...overrides,
  };
}

function createDeparture(overrides: Partial<LocationVote>): LocationVote {
  return {
    departureLat: 37.5,
    departureLng: 127,
    departureLocation: "서울시",
    locationVoteId: 1,
    participantName: "참가자A",
    ...overrides,
  };
}

describe("isNearbyDepartureResult", () => {
  it("상위 추천 후보들의 평균 시간이 5분 이하 차이고 1순위 모든 경로가 15분 이하면 true를 반환한다", () => {
    const recommendations = [
      createRecommendation({ avgTransitDuration: 8.5, rank: 1 }),
      createRecommendation({ avgTransitDuration: 10, rank: 2, stationId: 2 }),
      createRecommendation({ avgTransitDuration: 12, rank: 3, stationId: 3 }),
    ];

    expect(isNearbyDepartureResult(recommendations)).toBe(true);
  });

  it("출발지가 가까우면 추천 후보 간 평균 시간이 벌어져도 true를 반환한다", () => {
    const recommendations = [
      createRecommendation({ avgTransitDuration: 6.5, rank: 1 }),
      createRecommendation({ avgTransitDuration: 9, rank: 2, stationId: 2 }),
      createRecommendation({ avgTransitDuration: 19, rank: 3, stationId: 3 }),
    ];
    const departures = [
      createDeparture({
        departureLat: 37.5727,
        departureLng: 127.0164,
        departureLocation: "동묘앞역",
        locationVoteId: 1,
      }),
      createDeparture({
        departureLat: 37.5714,
        departureLng: 127.0095,
        departureLocation: "동대문역",
        locationVoteId: 2,
        participantName: "참가자B",
      }),
    ];

    expect(isNearbyDepartureResult(recommendations, departures)).toBe(true);
  });

  it("추천 후보가 하나뿐이면 false를 반환한다", () => {
    expect(isNearbyDepartureResult([createRecommendation({})])).toBe(false);
  });

  it("1순위 경로 중 하나라도 도달 불가이면 false를 반환한다", () => {
    const recommendations = [
      createRecommendation({
        routes: [
          {
            departureAddress: "합정역",
            departureName: "참가자A",
            drivingDistance: 1500,
            drivingDuration: 8,
            participantId: 1,
            transitDistance: 1000,
            transitDuration: 8,
            transitReachable: true,
          },
          {
            departureAddress: "독도",
            departureName: "참가자B",
            drivingDistance: 0,
            drivingDuration: 999,
            participantId: 2,
            transitDistance: 0,
            transitDuration: 999,
            transitReachable: false,
          },
        ],
      }),
      createRecommendation({ avgTransitDuration: 10, rank: 2, stationId: 2 }),
    ];

    expect(isNearbyDepartureResult(recommendations)).toBe(false);
  });

  it("1순위 경로가 비어 있으면 false를 반환한다", () => {
    const recommendations = [
      createRecommendation({ routes: [] }),
      createRecommendation({ avgTransitDuration: 10, rank: 2, stationId: 2 }),
    ];

    expect(isNearbyDepartureResult(recommendations)).toBe(false);
  });

  it("1순위 경로 중 하나라도 15분을 초과하면 false를 반환한다", () => {
    const recommendations = [
      createRecommendation({
        routes: [
          {
            departureAddress: "합정역",
            departureName: "참가자A",
            drivingDistance: 1500,
            drivingDuration: 8,
            participantId: 1,
            transitDistance: 1000,
            transitDuration: 8,
            transitReachable: true,
          },
          {
            departureAddress: "신촌역",
            departureName: "참가자B",
            drivingDistance: 3000,
            drivingDuration: 12,
            participantId: 2,
            transitDistance: 2600,
            transitDuration: 16,
            transitReachable: true,
          },
        ],
      }),
      createRecommendation({ avgTransitDuration: 10, rank: 2, stationId: 2 }),
    ];

    expect(isNearbyDepartureResult(recommendations)).toBe(false);
  });

  it("출발지가 멀리 떨어져 있으면 false를 반환한다", () => {
    const recommendations = [
      createRecommendation({ avgTransitDuration: 8, rank: 1 }),
      createRecommendation({ avgTransitDuration: 14, rank: 2, stationId: 2 }),
    ];
    const departures = [
      createDeparture({ departureLat: 37.5, departureLng: 127 }),
      createDeparture({
        departureLat: 37.65,
        departureLng: 126.77,
        locationVoteId: 2,
        participantName: "참가자B",
      }),
    ];

    expect(isNearbyDepartureResult(recommendations, departures)).toBe(false);
  });
});
