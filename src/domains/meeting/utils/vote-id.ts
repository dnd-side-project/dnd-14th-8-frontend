/**
 * 투표 id로 등록 여부를 판단한다.
 *
 * 서버가 미등록을 null이 아니라 0으로 내려주는 경우가 있어 `!= null`로는
 * 미등록자를 등록자로 잘못 읽는다. 실제 투표 id는 항상 양수이므로 양수만
 * 등록으로 친다. 일정 투표와 출발지 투표 모두 같은 규칙을 쓴다.
 */
export function hasVoteId(voteId?: number | null): boolean {
  return typeof voteId === "number" && voteId > 0;
}
