import type { ParticipantResponse } from "@/domains/meeting/types/participant-api-types";
import { hasVoteId } from "@/domains/meeting/utils/vote-id";

/**
 * 홈으로 나갔다가 최근 모임 목록을 통해 이 모임으로 돌아올 수 있는지 판단한다.
 *
 * 최근 모임은 서버가 게스트 UUID로 조회하므로, 서버에 참여 이력이 남은
 * 사람만 다시 찾아올 수 있다. 팀장은 모임 생성 시 등록되고 팀원은 일정
 * 투표나 출발지를 등록할 때 등록된다. 초대 수락은 localStorage에만
 * 남으므로 링크로 들어와 아직 아무것도 하지 않은 팀원은 돌아올 길이 없다.
 */
export function canReturnToMeeting(
  participant: ParticipantResponse | null | undefined,
): boolean {
  if (!participant) return false;

  return (
    participant.isHost ||
    hasVoteId(participant.scheduleVoteId) ||
    hasVoteId(participant.locationVoteId)
  );
}
