import { describe, expect, it } from "vitest";
import { normalizeMidpointResponse } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import type {
  MidpointRecommendationResponse,
  StationRecommendationDto,
} from "@/domains/location/types/location-api-types";

function createRecommendation(
  overrides: Partial<StationRecommendationDto>,
): StationRecommendationDto {
  return {
    avgTransitDuration: 25,
    distanceFromCenter: 120,
    latitude: 37.5,
    line: "2호선",
    longitude: 127,
    rank: 1,
    routes: [],
    stationId: 1,
    stationName: "강남역",
    ...overrides,
  };
}

describe("normalizeMidpointResponse", () => {
  it("같은 stationId의 중간지점 추천 역은 한 번만 남긴다", () => {
    const response: MidpointRecommendationResponse = {
      centerPoint: { latitude: 37.5, longitude: 127 },
      departureTime: null,
      recommendations: [
        createRecommendation({
          rank: 1,
          stationId: 10,
          stationName: "합정역",
        }),
        createRecommendation({
          rank: 2,
          stationId: 20,
          stationName: "홍대입구역",
        }),
        createRecommendation({
          rank: 3,
          stationId: 10,
          stationName: "합정역",
        }),
        createRecommendation({
          rank: 4,
          stationId: 30,
          stationName: "신촌역",
        }),
      ],
      registeredCount: 4,
      totalCount: 4,
    };

    expect(normalizeMidpointResponse(response).recommendations).toEqual([
      expect.objectContaining({ rank: 1, stationId: 10 }),
      expect.objectContaining({ rank: 2, stationId: 20 }),
      expect.objectContaining({ rank: 4, stationId: 30 }),
    ]);
  });

  it("stationId가 달라도 역 이름과 좌표가 같으면 한 번만 남긴다", () => {
    const response: MidpointRecommendationResponse = {
      centerPoint: { latitude: 37.5, longitude: 127 },
      departureTime: null,
      recommendations: [
        createRecommendation({
          latitude: 37.556,
          longitude: 126.923,
          rank: 1,
          stationId: 10,
          stationName: "합정역",
        }),
        createRecommendation({
          latitude: 37.556,
          line: "6호선",
          longitude: 126.923,
          rank: 2,
          stationId: 11,
          stationName: "합정역",
        }),
        createRecommendation({
          latitude: 37.557,
          longitude: 126.935,
          rank: 3,
          stationId: 20,
          stationName: "홍대입구역",
        }),
      ],
      registeredCount: 4,
      totalCount: 4,
    };

    expect(normalizeMidpointResponse(response).recommendations).toEqual([
      expect.objectContaining({ rank: 1, stationId: 10 }),
      expect.objectContaining({ rank: 3, stationId: 20 }),
    ]);
  });
});
