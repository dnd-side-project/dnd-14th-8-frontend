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

function createFallbackPlace(query: string): PlaceItem[] {
  const seed = Array.from(query).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const latitude = 37.5 + (seed % 100) * 0.0005;
  const longitude = 126.9 + (seed % 100) * 0.0005;

  return [
    {
      title: query,
      address: query,
      roadAddress: "",
      x: String(longitude),
      y: String(latitude),
    },
  ];
}

// 검색은 입력할 때마다 돌아서, 실패 토스트가 쌓이지 않도록 같은 id로 바꿔 띄운다.
const SEARCH_ERROR_TOAST_ID = "place-search-error";

export function usePlaceSearch() {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

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
          toast.error("장소를 검색하지 못했어요. 다시 시도해주세요", {
            id: SEARCH_ERROR_TOAST_ID,
          });
        }

        setLoading(false);
      });

      return;
    }

    try {
      const kakaoPlaces = await searchByKakaoRestApi(query);
      setResults(kakaoPlaces);
    } catch {
      toast.error("장소를 검색하지 못해 입력한 글자로 보여 드려요", {
        id: SEARCH_ERROR_TOAST_ID,
      });
      setResults(createFallbackPlace(query));
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}
