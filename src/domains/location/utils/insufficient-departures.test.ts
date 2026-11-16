import { describe, expect, it } from "vitest";
import {
  canManageDepartures,
  getInsufficientDepartureCopy,
  hasEnoughDepartures,
} from "@/domains/location/utils/insufficient-departures";

describe("hasEnoughDepartures", () => {
  it("출발지가 2개 미만이면 중간지점을 볼 수 없다", () => {
    expect(hasEnoughDepartures(0)).toBe(false);
    expect(hasEnoughDepartures(1)).toBe(false);
  });

  it("출발지가 2개 이상이면 중간지점을 볼 수 있다", () => {
    expect(hasEnoughDepartures(2)).toBe(true);
    expect(hasEnoughDepartures(5)).toBe(true);
  });
});

describe("getInsufficientDepartureCopy", () => {
  it("출발지가 없으면 두 명 이상이 필요하다고 안내한다", () => {
    expect(
      getInsufficientDepartureCopy({
        registeredCount: 0,
        hasMyDeparture: false,
      }),
    ).toEqual({
      title: "두 명 이상의 출발지가 필요해요",
      description: "링크를 공유하거나 직접 출발지를 추가해 보세요",
    });
  });

  it("내 출발지만 있으면 링크 공유를 권한다", () => {
    expect(
      getInsufficientDepartureCopy({
        registeredCount: 1,
        hasMyDeparture: true,
      }),
    ).toEqual({
      title: "출발지가 하나 더 필요해요",
      description: "링크를 공유하면 다른 참여자도 출발지를 추가할 수 있어요",
    });
  });

  it("다른 사람만 등록했으면 내 출발지 추가를 안내한다", () => {
    expect(
      getInsufficientDepartureCopy({
        registeredCount: 1,
        hasMyDeparture: false,
      }),
    ).toEqual({
      title: "출발지가 하나 더 필요해요",
      description: "출발지를 추가하면 중간 지점을 찾을 수 있어요",
    });
  });
});

describe("canManageDepartures", () => {
  it("아무도 등록하지 않았으면 등록 화면으로 보낸다", () => {
    expect(
      canManageDepartures({ registeredCount: 0, hasMyDeparture: false }),
    ).toBe(false);
  });

  it("다른 사람만 등록했으면 등록 화면으로 보낸다", () => {
    expect(
      canManageDepartures({ registeredCount: 1, hasMyDeparture: false }),
    ).toBe(false);
  });

  it("내 출발지가 있으면 관리 화면으로 보낸다", () => {
    expect(
      canManageDepartures({ registeredCount: 1, hasMyDeparture: true }),
    ).toBe(true);
  });

  it("출발지가 충분하면 내 출발지가 없어도 관리 화면으로 보낸다", () => {
    expect(
      canManageDepartures({ registeredCount: 2, hasMyDeparture: false }),
    ).toBe(true);
  });
});
