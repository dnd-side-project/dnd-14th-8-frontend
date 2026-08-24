import { describe, expect, it } from "vitest";
import { normalizeScheduleVoteId, toIsoDates } from "./schedule-vote";

describe("toIsoDates", () => {
  // 서버의 SchedulePoll.startTime/endTime은 벽시계 기준 분(minute)이다.
  // 투표 시각을 UTC로 보내면 같은 기준으로 비교되지 않아
  // deleteOutOfRangeVotes가 정상 투표를 범위 밖으로 판정한다.
  it("사용자가 고른 슬롯의 벽시계 시각을 그대로 보낸다", () => {
    expect(toIsoDates([new Date(2026, 1, 10, 9, 0)])).toEqual([
      "2026-02-10T09:00:00",
    ]);
  });

  it("30분 슬롯과 자정 직전 슬롯도 벽시계 그대로 보낸다", () => {
    expect(
      toIsoDates([new Date(2026, 1, 10, 9, 30), new Date(2026, 1, 10, 23, 30)]),
    ).toEqual(["2026-02-10T09:30:00", "2026-02-10T23:30:00"]);
  });

  it("자정 슬롯은 날짜를 넘기지 않는다", () => {
    expect(toIsoDates([new Date(2026, 1, 10, 0, 0)])).toEqual([
      "2026-02-10T00:00:00",
    ]);
  });
});

describe("normalizeScheduleVoteId", () => {
  it("유효한 id는 그대로 반환한다", () => {
    expect(normalizeScheduleVoteId(12)).toBe(12);
  });

  it("없거나 0 이하인 id는 undefined로 만든다", () => {
    expect(normalizeScheduleVoteId(null)).toBeUndefined();
    expect(normalizeScheduleVoteId(0)).toBeUndefined();
    expect(normalizeScheduleVoteId(-1)).toBeUndefined();
  });
});
