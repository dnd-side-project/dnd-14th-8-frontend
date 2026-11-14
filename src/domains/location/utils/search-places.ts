// 주소 검색 화면의 검색이다. 키워드(장소 이름) 검색 결과가 없으면 주소 검색으로 한 번 더 찾는다.
// 예전에는 결과가 없을 때 입력한 글자를 서울시청 좌표로 저장하는 "직접 등록"이 있었다.
// "연희동 123-4"처럼 장소 이름이 아닌 주소는 주소 검색으로 진짜 좌표를 찾아 고르게 한다. (#240)

export interface PlaceItem {
  // place: 키워드 검색으로 찾은 장소. 이름과 주소가 따로 있다.
  // address: 주소 검색으로 찾은 주소. 이름이 없어 title도 주소다.
  kind: "place" | "address";
  title: string;
  address: string;
  roadAddress: string;
  x: string;
  y: string;
}

interface KakaoKeywordDocument {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface KakaoAddressDocument {
  address_name: string;
  x: string;
  y: string;
}

type KakaoCallback<T> = (data: T[], status: string) => void;

interface KakaoServices {
  Places: new () => {
    keywordSearch: (
      query: string,
      callback: KakaoCallback<KakaoKeywordDocument>,
    ) => void;
  };
  Geocoder: new () => {
    addressSearch: (
      query: string,
      callback: KakaoCallback<KakaoAddressDocument>,
    ) => void;
  };
  Status: { OK: string; ZERO_RESULT: string };
}

function getKakaoServices() {
  return (window.kakao as { maps?: { services?: KakaoServices } } | undefined)
    ?.maps?.services;
}

function toPlaceItems(documents: KakaoKeywordDocument[]): PlaceItem[] {
  return documents.map((item) => ({
    kind: "place",
    title: item.place_name,
    address: item.address_name,
    roadAddress: item.road_address_name,
    x: item.x,
    y: item.y,
  }));
}

// 고르면 화면에 보인 한 줄(address_name)을 그대로 출발지 주소로 저장한다.
function toAddressItems(documents: KakaoAddressDocument[]): PlaceItem[] {
  return documents.map((item) => ({
    kind: "address",
    title: item.address_name,
    address: item.address_name,
    roadAddress: "",
    x: item.x,
    y: item.y,
  }));
}

// SDK 콜백을 Promise로 바꾼다. 결과 없음은 빈 배열, 그 밖의 상태는 실패다.
function callKakaoService<T>(
  services: KakaoServices,
  request: (callback: KakaoCallback<T>) => void,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    request((data, status) => {
      if (status === services.Status.OK) {
        resolve(data);
      } else if (status === services.Status.ZERO_RESULT) {
        resolve([]);
      } else {
        reject(new Error("KAKAO_SERVICES_ERROR"));
      }
    });
  });
}

async function searchBySdk(
  services: KakaoServices,
  query: string,
): Promise<PlaceItem[]> {
  const places = await callKakaoService<KakaoKeywordDocument>(
    services,
    (callback) => new services.Places().keywordSearch(query, callback),
  );

  if (places.length > 0) {
    return toPlaceItems(places);
  }

  const addresses = await callKakaoService<KakaoAddressDocument>(
    services,
    (callback) => new services.Geocoder().addressSearch(query, callback),
  );

  return toAddressItems(addresses);
}

async function fetchKakaoLocal<T>(path: string, query: string): Promise<T[]> {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/${path}?query=${encodeURIComponent(
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

  const payload = (await response.json()) as { documents: T[] };
  return payload.documents;
}

// SDK가 없을 때 쓴다. SDK와 같은 순서로 키워드, 주소 순서로 찾는다.
async function searchByRestApi(query: string): Promise<PlaceItem[]> {
  const places = await fetchKakaoLocal<KakaoKeywordDocument>(
    "keyword.json",
    query,
  );

  if (places.length > 0) {
    return toPlaceItems(places);
  }

  const addresses = await fetchKakaoLocal<KakaoAddressDocument>(
    "address.json",
    query,
  );

  return toAddressItems(addresses);
}

// 못 찾으면 빈 배열이고, 카카오가 실패를 돌려주면 reject한다.
export function searchPlaces(query: string): Promise<PlaceItem[]> {
  const services = getKakaoServices();

  return services ? searchBySdk(services, query) : searchByRestApi(query);
}

export type PlaceSearchOutcome =
  | { type: "results"; results: PlaceItem[] }
  | { type: "failed" }
  | { type: "stale" };

// 입력할 때마다 검색이 돌아서, 앞 검색어의 응답이 뒤 검색어의 응답보다 늦게 올 수 있다.
// 주소 검색까지 하면 그 틈이 더 길어진다. 마지막으로 부른 검색의 응답만 쓰고,
// 그 사이에 다른 검색(빈 검색어 포함)을 불렀으면 stale로 돌려줘 버리게 한다.
export function createLatestPlaceSearch(search = searchPlaces) {
  let latestId = 0;

  return async function runLatest(query: string): Promise<PlaceSearchOutcome> {
    latestId += 1;
    const id = latestId;

    if (!query.trim()) {
      return { type: "results", results: [] };
    }

    try {
      const results = await search(query);
      return id === latestId ? { type: "results", results } : { type: "stale" };
    } catch {
      return id === latestId ? { type: "failed" } : { type: "stale" };
    }
  };
}
