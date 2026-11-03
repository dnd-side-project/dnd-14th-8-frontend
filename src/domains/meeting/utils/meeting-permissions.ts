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

/**
 * 모임의 진행 단계.
 *
 * - scheduling: 일정을 모으는 중
 * - confirmed: 모임장이 일정을 확정하고 장소 정하기로 넘어간 뒤
 *
 * 투표 전과 후는 할 수 있는 일을 바꾸지 않아(버튼 문구만 바뀐다) 단계로 나누지
 * 않는다. 장소 단계는 서버에서 일정 확정과 같은 상태다.
 */
export type MeetingPhase = "scheduling" | "confirmed";

export interface MeetingPermissions {
  /** 내 가능한 시간을 입력하거나 고칠 수 있다 */
  canVote: boolean;
  /** 시간표 범위(날짜와 시간)를 고칠 수 있다 */
  canEditRange: boolean;
  /** 모임 인원을 고칠 수 있다 */
  canEditParticipantCount: boolean;
  /** 일정을 확정하고 장소 정하기로 넘어갈 수 있다 */
  canConfirmSchedule: boolean;
  /** 확정된 일정으로 장소 화면에 갈 수 있다 */
  canMoveToLocation: boolean;
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

/**
 * 서버의 일정 투표 상태(pollStatus)로 진행 단계를 정한다.
 *
 * 서버 값은 INACTIVE, VOTING, CONFIRMED이고 확정만 단계를 바꾼다. 응답 전이거나
 * 모르는 값이면 일정을 모으는 중으로 본다.
 */
export function toMeetingPhase(pollStatus?: string | null): MeetingPhase {
  return pollStatus === "CONFIRMED" ? "confirmed" : "scheduling";
}

const NOTHING: MeetingPermissions = {
  canVote: false,
  canEditRange: false,
  canEditParticipantCount: false,
  canConfirmSchedule: false,
  canMoveToLocation: false,
};

/** 진행 단계와 역할마다 할 수 있는 일. 권한 규칙은 이 표 하나로 본다. */
const PERMISSIONS: Record<
  MeetingPhase,
  Record<MeetingRole, MeetingPermissions>
> = {
  scheduling: {
    host: {
      ...NOTHING,
      canVote: true,
      canEditRange: true,
      canEditParticipantCount: true,
      canConfirmSchedule: true,
    },
    participant: { ...NOTHING, canVote: true },
    visitor: { ...NOTHING, canVote: true },
  },
  // 확정 모달의 "이동 후 일정 추가 및 수정이 불가능해요"를 지킨다.
  // 인원은 장소 단계에서도 "몇 명 중 몇 명"에 쓰여 모임장이 계속 고칠 수 있다.
  confirmed: {
    host: {
      ...NOTHING,
      canEditParticipantCount: true,
      canMoveToLocation: true,
    },
    participant: { ...NOTHING, canMoveToLocation: true },
    visitor: { ...NOTHING, canMoveToLocation: true },
  },
};

/** 역할과 진행 단계에 따라 할 수 있는 일을 돌려준다. 화면은 이 결과만 확인한다. */
export function getMeetingPermissions({
  role,
  phase,
}: {
  role: MeetingRole;
  phase: MeetingPhase;
}): MeetingPermissions {
  return PERMISSIONS[phase][role];
}
