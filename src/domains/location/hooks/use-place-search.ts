// use-place-search.ts
import { useCallback, useState } from "react";

export interface PlaceItem {
  title: string; // 장소명 (예: 홍대공원)
  address: string; // 지번 주소
  roadAddress: string; // 도로명 주소
  x: string;
  y: string;
}

export function usePlaceSearch() {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // biome-ignore lint/suspicious/noExplicitAny: Kakao SDK access
    const kakao = (window as any).kakao;

    if (!kakao || !kakao.maps?.services) {
      setError("라이브러리 로드 오류");
      return;
    }

    setLoading(true);
    const ps = new kakao.maps.services.Places();
    // biome-ignore lint/suspicious/noExplicitAny: Kakao SDK access
    ps.keywordSearch(query, (data: any[], status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        // API 응답의 'place_name'을 title로 매핑하여 장소 이름이 나오게 합니다.
        const items = data.map((item) => ({
          title: item.place_name,
          address: item.address_name,
          roadAddress: item.road_address_name,
          x: item.x,
          y: item.y,
        }));
        setResults(items);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        setResults([]);
      }
      setLoading(false);
    });
  }, []);

  return { results, loading, error, search };
}
