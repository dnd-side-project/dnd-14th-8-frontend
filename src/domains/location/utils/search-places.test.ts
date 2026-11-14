import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createLatestPlaceSearch,
  type PlaceItem,
  searchPlaces,
} from "@/domains/location/utils/search-places";

type Callback = (data: unknown[], status: string) => void;

const SEODAEMUN_STATION = {
  place_name: "서대문역 5호선",
  address_name: "서울 종로구 평동 210",
  road_address_name: "서울 종로구 통일로 지하 126",
  x: "126.96664",
  y: "37.56575",
};

// 주소 이름은 카카오가 2026-11-10에 "연희동 123-4"로 돌려준 것이고, 좌표는 테스트용 근삿값이다. (#240)
const YEONHUI_ADDRESSES = [
  { address_name: "서울 서대문구 연희동 123-4", x: "126.9311", y: "37.5689" },
  { address_name: "인천 서해구 연희동 123-4", x: "126.6727", y: "37.5413" },
];

const YEONHUI_ITEMS: PlaceItem[] = [
  {
    kind: "address",
    title: "서울 서대문구 연희동 123-4",
    address: "서울 서대문구 연희동 123-4",
    roadAddress: "",
    x: "126.9311",
    y: "37.5689",
  },
  {
    kind: "address",
    title: "인천 서해구 연희동 123-4",
    address: "인천 서해구 연희동 123-4",
    roadAddress: "",
    x: "126.6727",
    y: "37.5413",
  },
];

// 카카오 SDK의 Places와 Geocoder를 흉내 낸다. 각 검색이 어떤 상태로 답할지는 테스트가 정한다.
function stubKakaoSdk({
  keyword,
  address,
}: {
  keyword: [unknown[], string];
  address: [unknown[], string];
}) {
  const addressSearch = vi.fn((_query: string, callback: Callback) =>
    callback(...address),
  );

  class Places {
    keywordSearch(_query: string, callback: Callback) {
      callback(...keyword);
    }
  }

  class Geocoder {
    addressSearch = addressSearch;
  }

  vi.stubGlobal("window", {
    kakao: {
      maps: {
        services: {
          Places,
          Geocoder,
          Status: { OK: "OK", ZERO_RESULT: "ZERO_RESULT", ERROR: "ERROR" },
        },
      },
    },
  });

  return { addressSearch };
}

// SDK가 없을 때의 REST 응답을 흉내 낸다. 주소마다 돌려줄 documents를 정한다.
function stubRestApi(documentsByPath: Record<string, unknown[]>) {
  vi.stubGlobal("window", {});
  const fetchMock = vi.fn(async (url: string) => {
    const path = new URL(url).pathname.split("/").pop() ?? "";
    const documents = documentsByPath[path];

    if (!documents) {
      return { ok: false, json: async () => ({}) };
    }

    return { ok: true, json: async () => ({ documents }) };
  });
  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchPlaces: 카카오 SDK", () => {
  it("키워드 결과가 있으면 그대로 보여 주고 주소 검색은 부르지 않는다", async () => {
    const { addressSearch } = stubKakaoSdk({
      keyword: [[SEODAEMUN_STATION], "OK"],
      address: [[], "ZERO_RESULT"],
    });

    await expect(searchPlaces("서대문역")).resolves.toEqual([
      {
        kind: "place",
        title: "서대문역 5호선",
        address: "서울 종로구 평동 210",
        roadAddress: "서울 종로구 통일로 지하 126",
        x: "126.96664",
        y: "37.56575",
      },
    ]);
    expect(addressSearch).not.toHaveBeenCalled();
  });

  it("키워드 결과가 없으면 주소 검색 결과를 주소 한 줄로 돌려준다", async () => {
    const { addressSearch } = stubKakaoSdk({
      keyword: [[], "ZERO_RESULT"],
      address: [YEONHUI_ADDRESSES, "OK"],
    });

    await expect(searchPlaces("연희동 123-4")).resolves.toEqual(YEONHUI_ITEMS);
    expect(addressSearch).toHaveBeenCalledWith(
      "연희동 123-4",
      expect.any(Function),
    );
  });

  it("키워드와 주소 검색 모두 결과가 없으면 빈 배열이다", async () => {
    stubKakaoSdk({
      keyword: [[], "ZERO_RESULT"],
      address: [[], "ZERO_RESULT"],
    });

    await expect(searchPlaces("서대뮨역")).resolves.toEqual([]);
  });

  it("키워드 검색이 실패하면 reject한다", async () => {
    const { addressSearch } = stubKakaoSdk({
      keyword: [[], "ERROR"],
      address: [YEONHUI_ADDRESSES, "OK"],
    });

    await expect(searchPlaces("연희동 123-4")).rejects.toThrow();
    expect(addressSearch).not.toHaveBeenCalled();
  });

  it("주소 검색이 실패하면 reject한다", async () => {
    stubKakaoSdk({
      keyword: [[], "ZERO_RESULT"],
      address: [[], "ERROR"],
    });

    await expect(searchPlaces("연희동 123-4")).rejects.toThrow();
  });
});

describe("searchPlaces: SDK가 없을 때 REST", () => {
  it("키워드 결과가 있으면 주소 검색을 부르지 않는다", async () => {
    const fetchMock = stubRestApi({ "keyword.json": [SEODAEMUN_STATION] });

    await expect(searchPlaces("서대문역")).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("키워드 결과가 없으면 같은 헤더로 주소 검색을 불러 결과를 돌려준다", async () => {
    const fetchMock = stubRestApi({
      "keyword.json": [],
      "address.json": YEONHUI_ADDRESSES,
    });

    await expect(searchPlaces("연희동 123-4")).resolves.toEqual(YEONHUI_ITEMS);
    expect(fetchMock).toHaveBeenLastCalledWith(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        "연희동 123-4",
      )}`,
      {
        headers: {
          Authorization: expect.stringMatching(/^KakaoAK /),
        },
      },
    );
  });

  it("키워드와 주소 검색 모두 결과가 없으면 빈 배열이다", async () => {
    stubRestApi({ "keyword.json": [], "address.json": [] });

    await expect(searchPlaces("서대뮨역")).resolves.toEqual([]);
  });

  it("주소 검색 응답이 실패면 reject한다", async () => {
    stubRestApi({ "keyword.json": [] });

    await expect(searchPlaces("연희동 123-4")).rejects.toThrow();
  });
});

// 응답이 언제 올지 테스트가 정하는 검색이다.
function createControlledSearch() {
  const pending = new Map<
    string,
    { resolve: (items: PlaceItem[]) => void; reject: (error: Error) => void }
  >();

  const search = (query: string) =>
    new Promise<PlaceItem[]>((resolve, reject) => {
      pending.set(query, { resolve, reject });
    });

  const respond = (query: string) => {
    const handlers = pending.get(query);
    if (!handlers) throw new Error(`${query} 검색을 부르지 않았다`);
    return handlers;
  };

  return { search, respond };
}

const item = (title: string): PlaceItem => ({
  kind: "place",
  title,
  address: title,
  roadAddress: title,
  x: "126.9",
  y: "37.5",
});

describe("createLatestPlaceSearch", () => {
  it("앞 검색어의 응답이 늦게 와도 마지막 검색어의 결과만 쓴다", async () => {
    const { search, respond } = createControlledSearch();
    const runLatest = createLatestPlaceSearch(search);

    const first = runLatest("서대");
    const second = runLatest("서대문역");

    respond("서대문역").resolve([item("서대문역 5호선")]);
    respond("서대").resolve([item("서대문형무소역사관")]);

    await expect(second).resolves.toEqual({
      type: "results",
      results: [item("서대문역 5호선")],
    });
    await expect(first).resolves.toEqual({ type: "stale" });
  });

  it("앞 검색어의 실패가 늦게 와도 실패로 보지 않는다", async () => {
    const { search, respond } = createControlledSearch();
    const runLatest = createLatestPlaceSearch(search);

    const first = runLatest("서대");
    const second = runLatest("서대문역");

    respond("서대문역").resolve([item("서대문역 5호선")]);
    respond("서대").reject(new Error("KAKAO_SERVICES_ERROR"));

    await expect(first).resolves.toEqual({ type: "stale" });
    await expect(second).resolves.toEqual({
      type: "results",
      results: [item("서대문역 5호선")],
    });
  });

  it("검색어를 지운 뒤 늦게 온 응답은 쓰지 않는다", async () => {
    const { search, respond } = createControlledSearch();
    const runLatest = createLatestPlaceSearch(search);

    const first = runLatest("서대문역");
    const cleared = runLatest("");

    await expect(cleared).resolves.toEqual({ type: "results", results: [] });

    respond("서대문역").resolve([item("서대문역 5호선")]);
    await expect(first).resolves.toEqual({ type: "stale" });
  });

  it("마지막 검색이 실패하면 failed다", async () => {
    const { search, respond } = createControlledSearch();
    const runLatest = createLatestPlaceSearch(search);

    const only = runLatest("서대문역");
    respond("서대문역").reject(new Error("KAKAO_SERVICES_ERROR"));

    await expect(only).resolves.toEqual({ type: "failed" });
  });
});
