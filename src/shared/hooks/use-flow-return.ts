import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import {
  getHistoryIndex,
  getHistoryRewindDelta,
} from "@/shared/utils/history-rewind";

/**
 * 폼이 처음 놓인 히스토리 위치를 기억한다.
 *
 * 장소 검색을 다녀오면 폼이 다시 마운트되면서 위치가 달라지므로, 검색 화면을
 * 거칠 때 실어 보낸 값(carried)이 있으면 그쪽을 쓴다.
 */
export function useFlowEntryIndex(carried?: number | null) {
  const [entryIdx] = useState<number | null>(
    () => carried ?? getHistoryIndex(),
  );

  return entryIdx;
}

/**
 * 폼을 끝내고 진입 직전 화면으로 되감는다.
 *
 * 목적지를 새로 push하면 뒤로가기가 이미 제출한 폼으로 돌아가므로, 폼과 그
 * 사이에 쌓인 항목을 한 번에 걷어낸다. 되감을 수 없는 진입(폼 URL로 바로
 * 들어온 경우 등)에서는 fallbackPath로 대신 보낸다.
 */
export function useFlowReturn({
  entryIdx,
  fallbackPath,
}: {
  entryIdx?: number | null;
  fallbackPath: string;
}) {
  const navigate = useNavigate();

  return useCallback(() => {
    const delta = getHistoryRewindDelta({
      currentIdx: getHistoryIndex(),
      entryIdx,
    });

    if (delta === null) {
      navigate(fallbackPath, { replace: true });
      return;
    }

    navigate(delta);
  }, [entryIdx, fallbackPath, navigate]);
}
