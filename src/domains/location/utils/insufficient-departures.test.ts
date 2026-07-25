import { describe, expect, it } from "vitest";
import { getInsufficientDepartureContent } from "./insufficient-departures";

describe("getInsufficientDepartureContent", () => {
  it("출발지가 없으면 첫 출발지 등록을 유도한다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 0,
        totalCount: 5,
        hasMyDeparture: false,
      }),
    ).toEqual({
      title: "출발지를 등록하면 중간지점을 찾을 수 있어요",
      description: null,
      progressText: "출발지 등록 0 / 5",
      remainingText: "중간지점 추천까지 2명 더 필요해요",
      helperText: null,
      totalStatusText: null,
      primaryAction: "add",
      secondaryAction: "share",
    });
  });

  it("내 출발지가 등록되어 있으면 공유를 우선 행동으로 안내한다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 1,
        totalCount: 5,
        hasMyDeparture: true,
      }),
    ).toEqual({
      title: "한 명만 더 등록하면 중간지점을 찾을 수 있어요",
      description: null,
      progressText: "출발지 등록 1 / 5",
      remainingText: "중간지점 추천까지 1명 더 필요해요",
      helperText: null,
      totalStatusText: null,
      primaryAction: "share",
      secondaryAction: "add",
    });
  });

  it("내 출발지가 없고 다른 출발지가 있으면 내 출발지 추가를 우선 행동으로 안내한다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 1,
        totalCount: 5,
        hasMyDeparture: false,
      }),
    ).toEqual({
      title: "내 출발지를 추가하면 중간지점을 찾을 수 있어요",
      description: null,
      progressText: "출발지 등록 1 / 5",
      remainingText: "중간지점 추천까지 1명 더 필요해요",
      helperText: null,
      totalStatusText: null,
      primaryAction: "add",
      secondaryAction: "share",
    });
  });

  it("2명 모임이면 전체 참여 현황 보조 문구를 생략한다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 1,
        totalCount: 2,
        hasMyDeparture: true,
      }).totalStatusText,
    ).toBeNull();
  });

  it("전체 인원 수가 0명으로 오면 진행 상태 분모는 최소 추천 조건으로 대체한다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 0,
        totalCount: 0,
        hasMyDeparture: false,
      }).progressText,
    ).toBe("출발지 등록 0 / 2");
  });

  it("내 출발지를 등록한 뒤에는 친구 공유를 유도한다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 1,
        totalCount: 5,
        hasMyDeparture: true,
      }),
    ).toMatchObject({
      title: "한 명만 더 등록하면 중간지점을 찾을 수 있어요",
      description: null,
      primaryAction: "share",
      secondaryAction: "add",
    });
  });
});
