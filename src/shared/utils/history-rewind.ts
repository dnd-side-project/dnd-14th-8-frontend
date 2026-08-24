/**
 * react-router는 히스토리 항목마다 window.history.state.idx에 스택 위치를 남긴다.
 * 이 값이 없으면(다른 방식으로 쌓인 항목) 되감기를 포기한다.
 */
export function getHistoryIndex(): number | null {
  const idx = window.history.state?.idx;

  return typeof idx === "number" ? idx : null;
}

/**
 * 폼을 끝내고 원래 있던 화면으로 돌아가기 위해 되감을 칸 수를 구한다.
 *
 * 제출 후 목적지를 push하면 스택에 폼이 남아, 뒤로가기가 이미 제출한 폼으로
 * 되돌아간다. 장소 검색처럼 중간 화면을 거치면 그 항목까지 함께 쌓인다.
 * 그래서 새로 쌓는 대신 폼에 진입하기 직전 위치까지 한 번에 되감는다.
 *
 * entryIdx는 폼이 처음 놓인 위치이므로 원래 화면은 그 한 칸 아래다.
 * 되감을 자리가 앱 밖이거나(폼이 첫 항목) 스택을 읽을 수 없으면 null을
 * 돌려주고, 호출부가 명시 경로로 대신 보내게 한다.
 */
export function getHistoryRewindDelta({
  currentIdx,
  entryIdx,
}: {
  currentIdx?: number | null;
  entryIdx?: number | null;
}): number | null {
  if (typeof entryIdx !== "number" || typeof currentIdx !== "number") {
    return null;
  }

  if (entryIdx <= 0 || currentIdx < entryIdx) return null;

  return entryIdx - 1 - currentIdx;
}
