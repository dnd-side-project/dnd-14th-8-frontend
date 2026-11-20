import { afterEach, describe, expect, it, vi } from "vitest";
import { searchNearbyPlaces } from "@/domains/location/utils/search-nearby-places";

type Callback = (data: unknown[], status: string) => void;

// 카카오가 돌려주는 모양을 따른 시험용 장소(이름과 주소는 지어낸 것).
const STUDY_ROOM = {
  id: "1001",
  place_name: "모여 스터디룸",
  address_name: "서울 중구 을지로3가 1",
  road_address_name: "서울 중구 을지로 100",
  x: "126.9912",
  y: "37.5668",
  distance: "120",
  place_url: "http://place.map.kakao.com/1001",
};

// 카카오 SDK의 Places를 흉내 낸다. 어떤 검색을 어떤 옵션으로 불렀는지 기록한다.
function stubKakaoPlaces([data, status]: [unknown[], string]) {
  const keywordSearch = vi.fn(
    (_keyword: string, callback: Callback, _options: unknown) =>
      callback(data, status),
  );
  const categorySearch = vi.fn(
    (_code: string, callback: Callback, _options: unknown) =>
      callback(data, status),
  );

  class Places {
    keywordSearch = keywordSearch;
    categorySearch = categorySearch;
  }

  vi.stubGlobal("window", {
    kakao: {
      maps: {
        services: {
          Places,
          Status: { OK: "OK", ZERO_RESULT: "ZERO_RESULT", ERROR: "ERROR" },
          SortBy: { ACCURACY: "accuracy", DISTANCE: "distance" },
        },
      },
    },
  });

  return { keywordSearch, categorySearch };
}

const STATION = { latitude: 37.566292, longitude: 126.990873 };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchNearbyPlaces", () => {
  it("스터디룸은 키워드 검색으로, 역 좌표 반경 1000m에서 가까운 순으로 15곳을 찾는다", async () => {
    const { keywordSearch, categorySearch } = stubKakaoPlaces([
      [STUDY_ROOM],
      "OK",
    ]);

    await searchNearbyPlaces({ ...STATION, category: "스터디룸" });

    expect(categorySearch).not.toHaveBeenCalled();
    expect(keywordSearch).toHaveBeenCalledWith(
      "스터디룸",
      expect.any(Function),
      {
        x: 126.990873,
        y: 37.566292,
        radius: 1000,
        size: 15,
        sort: "distance",
      },
    );
  });

  it("식당은 음식점 업종(FD6) 검색이다", async () => {
    const { keywordSearch, categorySearch } = stubKakaoPlaces([[], "OK"]);

    await searchNearbyPlaces({ ...STATION, category: "식당" });

    expect(keywordSearch).not.toHaveBeenCalled();
    expect(categorySearch).toHaveBeenCalledWith(
      "FD6",
      expect.any(Function),
      expect.objectContaining({ category_group_code: "FD6", sort: "distance" }),
    );
  });

  it("카카오 결과를 화면에서 쓰는 모양으로 바꾼다", async () => {
    stubKakaoPlaces([[STUDY_ROOM], "OK"]);

    await expect(
      searchNearbyPlaces({ ...STATION, category: "스터디룸" }),
    ).resolves.toEqual([
      {
        id: "1001",
        name: "모여 스터디룸",
        address: "서울 중구 을지로 100",
        distanceMeters: 120,
        latitude: 37.5668,
        longitude: 126.9912,
        placeUrl: "http://place.map.kakao.com/1001",
      },
    ]);
  });

  it("도로명 주소가 없으면 지번 주소를 쓴다", async () => {
    stubKakaoPlaces([[{ ...STUDY_ROOM, road_address_name: "" }], "OK"]);

    const [place] = await searchNearbyPlaces({
      ...STATION,
      category: "스터디룸",
    });

    expect(place.address).toBe("서울 중구 을지로3가 1");
  });

  it("결과가 없으면 빈 배열이다", async () => {
    stubKakaoPlaces([[], "ZERO_RESULT"]);

    await expect(
      searchNearbyPlaces({ ...STATION, category: "카페" }),
    ).resolves.toEqual([]);
  });

  it("카카오가 실패를 알리면 오류로 끝난다", async () => {
    stubKakaoPlaces([[], "ERROR"]);

    await expect(
      searchNearbyPlaces({ ...STATION, category: "회의실" }),
    ).rejects.toThrow("KAKAO_SERVICES_ERROR");
  });

  it("SDK가 없으면 오류로 끝난다", async () => {
    vi.stubGlobal("window", {});

    await expect(
      searchNearbyPlaces({ ...STATION, category: "카페" }),
    ).rejects.toThrow("KAKAO_SDK_NOT_LOADED");
  });
});
