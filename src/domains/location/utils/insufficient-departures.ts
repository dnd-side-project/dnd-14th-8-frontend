export interface InsufficientDepartureCopy {
  title: string;
  description: string;
}

/**
 * 출발지가 2개 미만일 때 바텀시트 문구. 출발지가 하나 있으면 하단 버튼이
 * 내 출발지 여부에 따라 "출발지 관리하기"와 "출발지 추가하기"로 갈리므로,
 * 설명도 그 사람이 보는 버튼에 맞춘다.
 */
export function getInsufficientDepartureCopy({
  registeredCount,
  hasMyDeparture,
}: {
  registeredCount: number;
  hasMyDeparture: boolean;
}): InsufficientDepartureCopy {
  if (registeredCount <= 0) {
    return {
      title: "두 명 이상의 출발지가 필요해요",
      description: "링크를 공유하거나 직접 출발지를 추가해 보세요",
    };
  }

  if (hasMyDeparture) {
    return {
      title: "출발지가 하나 더 필요해요",
      description: "링크를 공유하면 다른 참여자도 출발지를 추가할 수 있어요",
    };
  }

  return {
    title: "출발지가 하나 더 필요해요",
    description: "출발지를 추가하면 중간 지점을 찾을 수 있어요",
  };
}

/**
 * 중간지점을 계산하려면 출발지가 이만큼 있어야 한다. 서버도 이보다 적으면
 * 계산하지 않고 E425를 돌려준다.
 */
export const MIN_DEPARTURES_FOR_MIDPOINT = 2;

export function hasEnoughDepartures(count: number) {
  return count >= MIN_DEPARTURES_FOR_MIDPOINT;
}

/**
 * 내 출발지가 있거나 출발지가 이미 충분하면 관리 화면으로 보낸다. 관리 화면
 * 맨 위에 "출발지 추가하기"가 있어서 거기서도 새 출발지를 넣을 수 있다.
 * 아직 내 출발지가 없으면 등록 화면으로 바로 보내서 한 단계를 줄인다.
 */
export function canManageDepartures({
  registeredCount,
  hasMyDeparture,
}: {
  registeredCount: number;
  hasMyDeparture: boolean;
}) {
  return hasEnoughDepartures(registeredCount) || hasMyDeparture;
}
