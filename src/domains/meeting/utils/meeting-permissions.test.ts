import { describe, expect, it } from "vitest";
import {
  getMeetingPermissions,
  getMeetingRole,
  type MeetingPermissions,
  type MeetingRole,
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

describe("getMeetingPermissions", () => {
  const table: { role: MeetingRole; expected: MeetingPermissions }[] = [
    {
      role: "host",
      expected: {
        canEditRange: true,
        canEditParticipantCount: true,
        canConfirmSchedule: true,
      },
    },
    {
      role: "participant",
      expected: {
        canEditRange: false,
        canEditParticipantCount: false,
        canConfirmSchedule: false,
      },
    },
    {
      role: "visitor",
      expected: {
        canEditRange: false,
        canEditParticipantCount: false,
        canConfirmSchedule: false,
      },
    },
  ];

  it.each(table)("$role", ({ role, expected }) => {
    expect(getMeetingPermissions({ role })).toEqual(expected);
  });
});
