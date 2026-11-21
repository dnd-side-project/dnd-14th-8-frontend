import { describe, expect, it } from "vitest";
import {
  buildPlaceDetailPath,
  buildResultNearbyPath,
} from "@/domains/location/utils/nearby-paths";

describe("buildResultNearbyPath", () => {
  it("결과 화면의 주변 살펴보기 탭과 분류를 주소에 담는다", () => {
    const path = buildResultNearbyPath({
      meetingId: "m1",
      stationId: 101,
      category: "식당",
    });
    const url = new URL(path, "https://moyeorak.site");

    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("station_id")).toBe("101");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("식당");
  });

  it("역을 모르면 station_id를 빼서 결과 화면이 1순위 역을 고르게 한다", () => {
    const url = new URL(
      buildResultNearbyPath({ meetingId: "m1", category: "카페" }),
      "https://moyeorak.site",
    );

    expect(url.searchParams.has("station_id")).toBe(false);
  });
});

describe("buildPlaceDetailPath", () => {
  it("역 좌표와 카카오 장소 ID로 장소 상세 주소를 만든다", () => {
    const url = new URL(
      buildPlaceDetailPath({
        meetingId: "m1",
        latitude: 37.5663,
        longitude: 126.9918,
        placeId: "1001",
        stationId: 101,
        category: "스터디룸",
      }),
      "https://moyeorak.site",
    );

    expect(url.pathname).toBe(
      "/meetings/m1/location/nearby/37.5663x126.9918/places/1001",
    );
    expect(url.searchParams.get("station_id")).toBe("101");
    expect(url.searchParams.get("category")).toBe("스터디룸");
  });
});
