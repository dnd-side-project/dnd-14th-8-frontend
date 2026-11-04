import {
  PARTICIPANT_COUNT_MAX,
  PARTICIPANT_COUNT_MIN,
} from "@/domains/meeting/components/participant-count-chips";

/** 백엔드와 같은 기준이다. 실제 참여한 사람 수보다 적게 고칠 수 없다. */
export function getSelectableParticipantCountMin(joinedCount: number) {
  return Math.max(PARTICIPANT_COUNT_MIN, joinedCount);
}

export function getParticipantCountHelperText(joinedCount: number) {
  const min = getSelectableParticipantCountMin(joinedCount);
  const from = joinedCount > PARTICIPANT_COUNT_MIN ? `지금 참여한 ${min}` : min;
  return `${from}명부터 ${PARTICIPANT_COUNT_MAX}명까지 고를 수 있어요`;
}
