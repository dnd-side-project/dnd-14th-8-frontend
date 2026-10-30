import { describe, expect, it } from "vitest";
import {
  getMeetingPermissions,
  getMeetingRole,
  type MeetingPermissions,
  type MeetingPhase,
  type MeetingRole,
  toMeetingPhase,
} from "@/domains/meeting/utils/meeting-permissions";

describe("getMeetingRole", () => {
  it.each([
    { case: "참여 정보가 없으면", me: null, role: "visitor" },
    { case: "참여 정보를 아직 못 받았으면", me: undefined, role: "visitor" },
    {
      case: "isHost가 true면",
      me: { isHost: true, scheduleVoteId: null, locationVoteId: null },
      role: "host",
    },
    {
      case: "isHost가 false여도 값이 있다는 이유로 모임장이 되지 않는다(#122)",
      me: { isHost: false, scheduleVoteId: 3, locationVoteId: null },
      role: "participant",
    },
    {
      case: "출발지만 등록했어도",
      me: { isHost: false, scheduleVoteId: null, locationVoteId: 5 },
      role: "participant",
    },
    {
      case: "등록한 것이 없으면",
      me: { isHost: false, scheduleVoteId: null, locationVoteId: null },
      role: "visitor",
    },
    {
      case: "투표 id가 서버의 미등록 값 0이면",
      me: { isHost: false, scheduleVoteId: 0, locationVoteId: 0 },
      role: "visitor",
    },
  ] as const)("$case $role", ({ me, role }) => {
    expect(getMeetingRole(me)).toBe(role);
  });
});

describe("toMeetingPhase", () => {
  it.each([
    { pollStatus: "CONFIRMED", phase: "confirmed" },
    { pollStatus: "VOTING", phase: "scheduling" },
    { pollStatus: "INACTIVE", phase: "scheduling" },
    { pollStatus: undefined, phase: "scheduling" },
    { pollStatus: "UNKNOWN", phase: "scheduling" },
  ] as const)("$pollStatus → $phase", ({ pollStatus, phase }) => {
    expect(toMeetingPhase(pollStatus)).toBe(phase);
  });
});

describe("getMeetingPermissions", () => {
  // 역할 3개와 진행 단계 2개의 모든 조합. 행을 바꾸면 화면 동작이 바뀐다.
  const table: {
    phase: MeetingPhase;
    role: MeetingRole;
    expected: MeetingPermissions;
  }[] = [
    {
      phase: "scheduling",
      role: "host",
      expected: {
        canVote: true,
        canEditRange: true,
        canEditParticipantCount: true,
        canConfirmSchedule: true,
        canMoveToLocation: false,
      },
    },
    {
      phase: "scheduling",
      role: "participant",
      expected: {
        canVote: true,
        canEditRange: false,
        canEditParticipantCount: false,
        canConfirmSchedule: false,
        canMoveToLocation: false,
      },
    },
    {
      phase: "scheduling",
      role: "visitor",
      expected: {
        canVote: true,
        canEditRange: false,
        canEditParticipantCount: false,
        canConfirmSchedule: false,
        canMoveToLocation: false,
      },
    },
    {
      phase: "confirmed",
      role: "host",
      expected: {
        canVote: false,
        canEditRange: false,
        canEditParticipantCount: true,
        canConfirmSchedule: false,
        canMoveToLocation: true,
      },
    },
    {
      phase: "confirmed",
      role: "participant",
      expected: {
        canVote: false,
        canEditRange: false,
        canEditParticipantCount: false,
        canConfirmSchedule: false,
        canMoveToLocation: true,
      },
    },
    {
      phase: "confirmed",
      role: "visitor",
      expected: {
        canVote: false,
        canEditRange: false,
        canEditParticipantCount: false,
        canConfirmSchedule: false,
        canMoveToLocation: true,
      },
    },
  ];

  it.each(table)("$phase 단계의 $role", ({ phase, role, expected }) => {
    expect(getMeetingPermissions({ role, phase })).toEqual(expected);
  });
});
