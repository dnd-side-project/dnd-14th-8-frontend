import { describe, expect, it } from "vitest";
import type { ParticipantResponse } from "@/domains/meeting/types/participant-api-types";
import { canReturnToMeeting } from "@/domains/meeting/utils/meeting-return";

function participant(
  overrides: Partial<ParticipantResponse> = {},
): ParticipantResponse {
  return {
    isHost: false,
    localStorageKey: "guest-1",
    locationVoteId: null,
    name: "지민",
    participantId: 1,
    scheduleVoteId: null,
    ...overrides,
  };
}

describe("canReturnToMeeting", () => {
  it("팀장은 모임 생성 시 서버에 등록되므로 돌아올 수 있다", () => {
    expect(canReturnToMeeting(participant({ isHost: true }))).toBe(true);
  });

  it("일정 투표를 등록한 팀원은 돌아올 수 있다", () => {
    expect(canReturnToMeeting(participant({ scheduleVoteId: 12 }))).toBe(true);
  });

  it("출발지를 등록한 팀원은 돌아올 수 있다", () => {
    expect(canReturnToMeeting(participant({ locationVoteId: 34 }))).toBe(true);
  });

  it("아무것도 등록하지 않은 팀원은 돌아올 수 없다", () => {
    expect(canReturnToMeeting(participant())).toBe(false);
  });

  it("참여자 조회가 404여서 null이면 돌아올 수 없다", () => {
    expect(canReturnToMeeting(null)).toBe(false);
  });

  it("아직 로딩 중이라 undefined이면 돌아올 수 없다고 본다", () => {
    expect(canReturnToMeeting(undefined)).toBe(false);
  });

  it("0은 미등록 sentinel이므로 등록으로 치지 않는다", () => {
    expect(
      canReturnToMeeting(participant({ locationVoteId: 0, scheduleVoteId: 0 })),
    ).toBe(false);
  });
});
