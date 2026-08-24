import { describe, expect, it } from "vitest";
import { toIsoDates } from "./schedule-vote";
import {
  getParticipantVotedDates,
  parseVotedDate,
  toOccupancyFromParticipants,
} from "./timetable";

describe("parseVotedDate", () => {
  // 서버는 Asia/Seoul 벽시계 기준 LocalDateTime을 오프셋 없이 내려준다.
  it("오프셋 없는 서버 문자열을 같은 벽시계 시각으로 읽는다", () => {
    expect(parseVotedDate("2026-02-10T09:00:00").getTime()).toBe(
      new Date(2026, 1, 10, 9, 0).getTime(),
    );
  });

  it("오프셋이 붙어 와도 서버가 의도한 벽시계 시각으로 읽는다", () => {
    expect(parseVotedDate("2026-02-10T09:00:00Z").getTime()).toBe(
      new Date(2026, 1, 10, 9, 0).getTime(),
    );
  });

  it("잘못된 문자열은 Invalid Date로 남긴다", () => {
    expect(Number.isNaN(parseVotedDate("nonsense").getTime())).toBe(true);
  });
});

describe("일정 투표 왕복", () => {
  it("보낸 슬롯을 서버 응답으로 다시 읽어도 같은 시각이다", () => {
    const slot = new Date(2026, 1, 10, 9, 0);
    const [sent] = toIsoDates([slot]);

    expect(parseVotedDate(sent).getTime()).toBe(slot.getTime());
  });
});

describe("toOccupancyFromParticipants", () => {
  it("슬롯별 투표 수를 벽시계 시각 기준으로 센다", () => {
    const occupancy = toOccupancyFromParticipants([
      { name: "가", votedDates: ["2026-02-10T09:00:00"] },
      { name: "나", votedDates: ["2026-02-10T09:00:00"] },
      { name: "다", votedDates: ["2026-02-10T09:30:00"] },
    ]);

    const nineAm = new Date(2026, 1, 10, 9, 0).getTime().toString();
    const nineThirty = new Date(2026, 1, 10, 9, 30).getTime().toString();

    expect(occupancy[nineAm]).toBe(2);
    expect(occupancy[nineThirty]).toBe(1);
  });
});

describe("getParticipantVotedDates", () => {
  it("해당 참여자의 투표 시각만 벽시계 기준으로 돌려준다", () => {
    const dates = getParticipantVotedDates(
      [
        { name: "가", votedDates: ["2026-02-10T09:00:00"] },
        { name: "나", votedDates: ["2026-02-10T18:00:00"] },
      ],
      "나",
    );

    expect(dates).toEqual([new Date(2026, 1, 10, 18, 0)]);
  });
});
