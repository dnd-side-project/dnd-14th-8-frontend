export type DepartureReturnTarget = "manage" | "result";

/**
 * 출발지를 등록한 뒤 어디로 돌아갈지 정한다.
 *
 * 기본은 중간지점 결과 화면이다. 등록 직후 필요한 다음 행동은 "친구 부르기"인데
 * 초대 링크 공유와 남은 인원 표시는 결과 화면에만 있다. 관리 화면으로 보내면
 * 혼자일 때 "중간지점 결과 보러가기"가 토스트만 띄우고 끝나 갈 곳이 없어진다.
 *
 * 다만 관리 화면에서 팀원들 출발지를 이어 등록하는 중이라면 매번 지도로
 * 튕겨내지 않고 관리 화면으로 돌려보낸다.
 */
export function getDepartureReturnPath({
  meetingId,
  returnTo,
}: {
  meetingId: string;
  returnTo?: DepartureReturnTarget | string | null;
}): string {
  const base = `/meetings/${meetingId}/location`;

  return returnTo === "manage" ? `${base}/votes` : `${base}/stations`;
}
