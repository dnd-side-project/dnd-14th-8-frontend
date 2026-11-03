import { describe, expect, it } from "vitest";
import { getMeetingPermissions } from "@/domains/meeting/utils/meeting-permissions";
import { getScheduleMainAction } from "@/domains/schedule/utils/schedule-main-action";

const host = getMeetingPermissions({ role: "host", phase: "scheduling" });
const participant = getMeetingPermissions({
  role: "participant",
  phase: "scheduling",
});
const confirmedHost = getMeetingPermissions({
  role: "host",
  phase: "confirmed",
});
const confirmedParticipant = getMeetingPermissions({
  role: "participant",
  phase: "confirmed",
});

describe("getScheduleMainAction", () => {
  it.each([
    {
      case: "모임장은 최적일정 탭에서 확정하러 간다",
      tab: "optimal",
      hasExistingVote: true,
      permissions: host,
      expected: { type: "confirm", label: "장소 정하러 가기" },
    },
    {
      case: "모임장도 시간표 탭에서는 일정을 고친다",
      tab: "vote",
      hasExistingVote: true,
      permissions: host,
      expected: { type: "vote", label: "일정 수정하기" },
    },
    {
      case: "참여자는 최적일정 탭에서도 확정하지 않는다",
      tab: "optimal",
      hasExistingVote: true,
      permissions: participant,
      expected: { type: "vote", label: "일정 수정하기" },
    },
    {
      case: "아직 일정을 넣지 않았으면 추가하기",
      tab: "vote",
      hasExistingVote: false,
      permissions: participant,
      expected: { type: "vote", label: "일정 추가하기" },
    },
    {
      case: "확정된 뒤 모임장은 다시 확정하지 않고 장소로 간다",
      tab: "optimal",
      hasExistingVote: true,
      permissions: confirmedHost,
      expected: { type: "move", label: "장소 보러 가기" },
    },
    {
      case: "확정된 뒤 참여자도 시간표 탭에서 장소로 간다",
      tab: "vote",
      hasExistingVote: true,
      permissions: confirmedParticipant,
      expected: { type: "move", label: "장소 보러 가기" },
    },
  ] as const)("$case", ({ tab, hasExistingVote, permissions, expected }) => {
    expect(
      getScheduleMainAction({ tab, hasExistingVote, permissions }),
    ).toEqual(expected);
  });
});
