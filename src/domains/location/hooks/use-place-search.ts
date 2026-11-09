import { useCallback, useState } from "react";
import { toast } from "@/shared/components/toast";

export interface PlaceItem {
  title: string;
  address: string;
  roadAddress: string;
  x: string;
  y: string;
}

interface KakaoKeywordSearchResponse {
  documents: Array<{
    place_name: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
  }>;
}

function mapPlaceItems(
  items: Array<{
    place_name: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
  }>,
): PlaceItem[] {
  return items.map((item) => ({
    title: item.place_name,
    address: item.address_name,
    roadAddress: item.road_address_name,
    x: item.x,
    y: item.y,
  }));
}

async function searchByKakaoRestApi(query: string) {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
      query,
    )}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("KAKAO_REST_API_ERROR");
  }

  const payload = (await response.json()) as KakaoKeywordSearchResponse;
  return mapPlaceItems(payload.documents);
}

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

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setFailed(false);
      return;
    }

    setLoading(true);
    setFailed(false);

    // biome-ignore lint/suspicious/noExplicitAny: Kakao SDK access
    const kakao = (window as any).kakao;

    if (kakao?.maps?.services) {
      const ps = new kakao.maps.services.Places();

      // biome-ignore lint/suspicious/noExplicitAny: Kakao SDK access
      ps.keywordSearch(query, (data: any[], status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          setResults(
            mapPlaceItems(
              data.map((item) => ({
                place_name: item.place_name,
                address_name: item.address_name,
                road_address_name: item.road_address_name,
                x: item.x,
                y: item.y,
              })),
            ),
          );
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setResults([]);
        } else {
          // 앞 검색어의 결과가 남아 고를 수 있게 되지 않도록 비운다.
          setResults([]);
          setFailed(true);
          showSearchFailure();
        }

        setLoading(false);
      });

      return;
    }

    try {
      const kakaoPlaces = await searchByKakaoRestApi(query);
      setResults(kakaoPlaces);
    } catch {
      // 예전에는 입력한 글자로 좌표를 계산한 가짜 장소를 보여 줬다. 고르면 엉뚱한 좌표가 저장되어 실패로 처리한다.
      setResults([]);
      setFailed(true);
      showSearchFailure();
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, failed, search };
}
