import { useCallback, useState } from "react";

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

function searchByNaverGeocode(query: string): Promise<PlaceItem[]> {
  return new Promise((resolve, reject) => {
    const geocode = window.naver?.maps?.Service?.geocode;
    if (!geocode) {
      reject(new Error("NAVER_GEOCODE_UNAVAILABLE"));
      return;
    }

    geocode(
      { query },
      (
        status: naver.maps.Service.Status,
        response: naver.maps.Service.GeocodeResponse,
      ) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          reject(new Error("NAVER_GEOCODE_FAILED"));
          return;
        }

        const addresses = response.v2.addresses ?? [];

        resolve(
          addresses.map((address) => ({
            title: address.roadAddress || address.jibunAddress || query,
            address: address.jibunAddress || "",
            roadAddress: address.roadAddress || "",
            x: address.x,
            y: address.y,
          })),
        );
      },
    );
  });
}

export function usePlaceSearch() {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

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
          setError("장소 검색에 실패했어요");
        }

        setLoading(false);
      });

      return;
    }

    try {
      const naverPlaces = await searchByNaverGeocode(query);
      setResults(naverPlaces);
      setLoading(false);
      return;
    } catch {
      // pass
    }

    try {
      const kakaoPlaces = await searchByKakaoRestApi(query);
      setResults(kakaoPlaces);
    } catch {
      setError("검색 SDK가 불안정해 직접 입력 좌표를 사용해요");
      setResults(createFallbackPlace(query));
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
