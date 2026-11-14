import { useCallback, useState } from "react";
import {
  createLatestPlaceSearch,
  type PlaceItem,
} from "@/domains/location/utils/search-places";
import { toast } from "@/shared/components/toast";

// 검색은 입력할 때마다 돌아서, 실패 토스트가 쌓이지 않도록 같은 id로 바꿔 띄운다.
const SEARCH_ERROR_TOAST_ID = "place-search-error";

function showSearchFailure() {
  toast.error("장소를 검색하지 못했어요. 다시 시도해주세요", {
    id: SEARCH_ERROR_TOAST_ID,
  });
}

export function usePlaceSearch() {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  // 실패는 결과 없음과 다르다. 화면이 "일치하는 주소가 없어요"를 띄우지 않도록 따로 둔다.
  const [failed, setFailed] = useState(false);
  const [runLatest] = useState(() => createLatestPlaceSearch());

  const search = useCallback(
    async (query: string) => {
      if (query.trim()) {
        setLoading(true);
      }
      setFailed(false);

      const outcome = await runLatest(query);

      // 뒤에 부른 검색이 있으면 그 응답이 화면을 정한다.
      if (outcome.type === "stale") return;

      if (outcome.type === "failed") {
        // 앞 검색어의 결과가 남아 고를 수 있게 되지 않도록 비운다.
        // 예전에는 입력한 글자로 좌표를 계산한 가짜 장소를 보여 줬다. 고르면 엉뚱한 좌표가 저장되어 실패로 처리한다.
        setResults([]);
        setFailed(true);
        showSearchFailure();
      } else {
        setResults(outcome.results);
      }

      setLoading(false);
    },
    [runLatest],
  );

  return { results, loading, failed, search };
}
