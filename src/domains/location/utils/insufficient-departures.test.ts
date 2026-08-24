import { describe, expect, it } from "vitest";
import { getInsufficientDepartureContent } from "./insufficient-departures";

const 지훈 = {
  locationVoteId: 11,
  participantName: "지훈",
  departureLocation: "강남역 2번 출구",
};
const 수아 = {
  locationVoteId: 22,
  participantName: "수아",
  departureLocation: "홍대입구역",
};

describe("getInsufficientDepartureContent", () => {
  it("출발지가 없으면 내 등록 슬롯과 대기 슬롯을 하나씩 만든다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 0,
        hasMyDeparture: false,
        departures: [],
      }),
    ).toEqual({
      title: "2명이 모이면 중간지점을 찾아드려요",
      slots: [
        { key: "empty-0", kind: "add-mine" },
        { key: "empty-1", kind: "waiting" },
      ],
      primaryAction: "add",
      secondaryAction: "share",
    });
  });

  it("내 출발지가 등록되어 있으면 남은 자리를 초대 슬롯으로 만든다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 1,
        hasMyDeparture: true,
        departures: [지훈],
        myLocationVoteId: 11,
      }),
    ).toEqual({
      title: "한 명만 더 등록하면 중간지점을 찾을 수 있어요",
      slots: [
        {
          key: "departure-11",
          kind: "filled",
          name: "지훈",
          location: "강남역 2번 출구",
          isMine: true,
        },
        { key: "empty-0", kind: "invite" },
      ],
      primaryAction: "share",
      secondaryAction: "add",
    });
  });

  it("다른 사람만 등록했으면 남은 자리를 내 등록 슬롯으로 만든다", () => {
    expect(
      getInsufficientDepartureContent({
        registeredCount: 1,
        hasMyDeparture: false,
        departures: [지훈],
        myLocationVoteId: null,
      }),
    ).toEqual({
      title: "내 출발지를 추가하면 중간지점을 찾을 수 있어요",
      slots: [
        {
          key: "departure-11",
          kind: "filled",
          name: "지훈",
          location: "강남역 2번 출구",
          isMine: false,
        },
        { key: "empty-0", kind: "add-mine" },
      ],
      primaryAction: "add",
      secondaryAction: "share",
    });
  });

  it("최소 추천 조건보다 많이 등록되어 있으면 등록 수만큼 슬롯을 만든다", () => {
    const { slots } = getInsufficientDepartureContent({
      registeredCount: 2,
      hasMyDeparture: true,
      departures: [지훈, 수아],
      myLocationVoteId: 22,
    });

    expect(slots).toHaveLength(2);
    expect(slots.every((slot) => slot.kind === "filled")).toBe(true);
  });

  it("등록 수보다 출발지 목록이 늦게 도착해도 슬롯 수는 최소 추천 조건을 지킨다", () => {
    const { slots } = getInsufficientDepartureContent({
      registeredCount: 1,
      hasMyDeparture: false,
      departures: [],
    });

    expect(slots).toEqual([
      { key: "empty-0", kind: "add-mine" },
      { key: "empty-1", kind: "waiting" },
    ]);
  });

  it("빈 자리가 여러 개면 첫 자리에만 행동을 붙이고 나머지는 대기로 둔다", () => {
    const { slots } = getInsufficientDepartureContent({
      registeredCount: 0,
      hasMyDeparture: true,
      departures: [],
    });

    expect(slots).toEqual([
      { key: "empty-0", kind: "invite" },
      { key: "empty-1", kind: "waiting" },
    ]);
  });

  it("진행 상태를 문장으로 반복하지 않는다", () => {
    const content = getInsufficientDepartureContent({
      registeredCount: 0,
      hasMyDeparture: false,
      departures: [],
    });

    expect(content).not.toHaveProperty("progressText");
    expect(content).not.toHaveProperty("remainingText");
    expect(content).not.toHaveProperty("totalStatusText");
    expect(content).not.toHaveProperty("helperText");
  });
});
