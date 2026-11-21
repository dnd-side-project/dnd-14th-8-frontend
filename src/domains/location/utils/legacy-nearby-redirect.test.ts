import { describe, expect, it } from "vitest";
import {
  buildLegacyNearbyRedirectPath,
  buildLegacyPlaceDetailRedirectPath,
  parseStationIdParam,
} from "@/domains/location/utils/legacy-nearby-redirect";

function redirectOf(search: string) {
  const path = buildLegacyNearbyRedirectPath({
    meetingId: "m1",
    searchParams: new URLSearchParams(search),
  });
  return new URL(path, "https://moyeorak.site");
}

describe("parseStationIdParam", () => {
  it("양의 정수만 역 번호로 읽는다", () => {
    expect(parseStationIdParam("101")).toBe(101);
    expect(parseStationIdParam(null)).toBeNull();
    expect(parseStationIdParam("")).toBeNull();
    expect(parseStationIdParam("0")).toBeNull();
    expect(parseStationIdParam("-1")).toBeNull();
    expect(parseStationIdParam("1e2")).toBeNull();
    expect(parseStationIdParam("101abc")).toBeNull();
  });
});

describe("buildLegacyNearbyRedirectPath", () => {
  it("옛 목록 주소의 역과 분류를 결과 화면 주변 살펴보기 탭으로 넘긴다", () => {
    const url = redirectOf("station_id=102&category=회의실");

    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("station_id")).toBe("102");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("회의실");
  });

  it("옛 분류 이름(음식점, 스터디카페)은 새 이름으로 바꾼다", () => {
    expect(
      redirectOf("station_id=101&category=음식점").searchParams.get("category"),
    ).toBe("식당");
    expect(
      redirectOf("station_id=101&category=스터디카페").searchParams.get(
        "category",
      ),
    ).toBe("스터디룸");
  });

  it("쿼리가 없으면 역을 빼고 첫 분류로 넘겨 결과 화면이 1순위 역을 고르게 한다", () => {
    const url = redirectOf("");

    expect(url.searchParams.has("station_id")).toBe(false);
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("스터디룸");
  });

  it("역 번호가 숫자가 아니면 역을 뺀다", () => {
    expect(
      redirectOf("station_id=abc&category=카페").searchParams.has("station_id"),
    ).toBe(false);
  });
});

describe("buildLegacyPlaceDetailRedirectPath", () => {
  function placeRedirectOf(placeId: string, search: string) {
    const path = buildLegacyPlaceDetailRedirectPath({
      meetingId: "m1",
      placeId,
      searchParams: new URLSearchParams(search),
    });
    return new URL(path, "https://moyeorak.site");
  }

  it("옛 장소 상세 주소의 역, 분류, 장소를 결과 화면의 고른 상태 주소로 넘긴다", () => {
    const url = placeRedirectOf("9000", "station_id=102&category=카페");

    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("station_id")).toBe("102");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("카페");
    expect(url.searchParams.get("place_id")).toBe("9000");
  });

  it("옛 분류 이름은 새 이름으로 바꾸고 좌표는 주소에 남기지 않는다", () => {
    const url = placeRedirectOf("9000", "station_id=101&category=스터디카페");

    expect(url.searchParams.get("category")).toBe("스터디룸");
    expect(url.search).not.toContain("37.5663");
  });

  it("쿼리가 없으면 역을 빼고 첫 분류로 넘겨 결과 화면이 1순위 역을 고르게 한다", () => {
    const url = placeRedirectOf("9000", "");

    expect(url.searchParams.has("station_id")).toBe(false);
    expect(url.searchParams.get("category")).toBe("스터디룸");
    expect(url.searchParams.get("place_id")).toBe("9000");
  });
});
