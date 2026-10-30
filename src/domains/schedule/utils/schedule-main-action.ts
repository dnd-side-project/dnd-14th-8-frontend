import type { MeetingPermissions } from "@/domains/meeting/utils/meeting-permissions";

export type ScheduleMainActionType = "confirm" | "vote";

export interface ScheduleMainAction {
  type: ScheduleMainActionType;
  label: string;
}

/** 일정 메인 하단 버튼이 무엇을 할지 정한다. */
export function getScheduleMainAction({
  tab,
  hasExistingVote,
  permissions,
}: {
  tab: "optimal" | "vote";
  hasExistingVote: boolean;
  permissions: MeetingPermissions;
}): ScheduleMainAction {
  if (tab === "optimal" && permissions.canConfirmSchedule) {
    return { type: "confirm", label: "장소 정하러 가기" };
  }

  return {
    type: "vote",
    label: hasExistingVote ? "일정 수정하기" : "일정 추가하기",
  };
}
