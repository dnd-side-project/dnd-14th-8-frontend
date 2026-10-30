import type { ParticipantResponse } from "@/domains/meeting/types/participant-api-types";
import { hasVoteId } from "@/domains/meeting/utils/vote-id";

/**
 * 모임에서 내 역할.
 *
 * - host: 모임을 만든 모임장
 * - participant: 일정이나 출발지를 등록한 참여자
 * - visitor: 초대 링크로 들어왔지만 아직 아무것도 등록하지 않은 사람
 */
export type MeetingRole = "host" | "participant" | "visitor";

export interface MeetingPermissions {
  /** 시간표 범위(날짜와 시간)를 고칠 수 있다 */
  canEditRange: boolean;
  /** 모임 인원을 고칠 수 있다 */
  canEditParticipantCount: boolean;
  /** 일정을 확정하고 장소 정하기로 넘어갈 수 있다 */
  canConfirmSchedule: boolean;
}

type MyParticipant = Pick<
  ParticipantResponse,
  "isHost" | "scheduleVoteId" | "locationVoteId"
>;

/**
 * 내 참여 정보로 역할을 정한다. 모임장 여부(isHost)는 여기서만 읽는다.
 *
 * isHost를 `!== undefined`로 읽어 false인 참여자도 모임장으로 본 적이 있다(#122).
 * 등록 여부는 투표 id로 판단한다(0은 서버의 미등록 값이라 등록으로 치지 않는다).
 */
export function getMeetingRole(me?: MyParticipant | null): MeetingRole {
  if (!me) return "visitor";
  if (me.isHost) return "host";
  if (hasVoteId(me.scheduleVoteId) || hasVoteId(me.locationVoteId)) {
    return "participant";
  }
  return "visitor";
}

const PERMISSIONS: Record<MeetingRole, MeetingPermissions> = {
  host: {
    canEditRange: true,
    canEditParticipantCount: true,
    canConfirmSchedule: true,
  },
  participant: {
    canEditRange: false,
    canEditParticipantCount: false,
    canConfirmSchedule: false,
  },
  visitor: {
    canEditRange: false,
    canEditParticipantCount: false,
    canConfirmSchedule: false,
  },
};

/** 역할에 따라 할 수 있는 일을 돌려준다. 화면은 역할 대신 이 결과만 확인한다. */
export function getMeetingPermissions({
  role,
}: {
  role: MeetingRole;
}): MeetingPermissions {
  return PERMISSIONS[role];
}
