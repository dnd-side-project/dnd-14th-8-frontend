import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FIND_ADDRESS_TIMEOUT_MS,
  findAddressByCoords,
} from "@/domains/location/utils/find-address-by-coords";

type Callback = (result: unknown[], status: string | null) => void;

// 카카오 SDK의 Geocoder를 흉내 낸다. 콜백을 언제 부를지는 각 테스트가 정한다.
function stubKakao(onRequest: (callback: Callback) => void) {
  class Geocoder {
    coord2Address(_lng: number, _lat: number, callback: Callback) {
      onRequest(callback);
    }
  }

  vi.stubGlobal("window", {
    kakao: { maps: { services: { Geocoder, Status: { OK: "OK" } } } },
  });
}

describe("findAddressByCoords", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("도로명 주소가 있으면 도로명 주소를 돌려준다", async () => {
    stubKakao((callback) =>
      callback(
        [
          {
            road_address: { address_name: "서울특별시 종로구 통일로 지하 126" },
            address: { address_name: "서울 종로구 평동 210" },
          },
        ],
        "OK",
      ),
    );

    await expect(findAddressByCoords(37.56575, 126.96664)).resolves.toBe(
      "서울특별시 종로구 통일로 지하 126",
    );
  });

  it("도로명 주소가 없으면 지번 주소를 돌려준다", async () => {
    stubKakao((callback) =>
      callback(
        [
          {
            road_address: null,
            address: { address_name: "경기 고양시 덕양구 북한동 산 1-1" },
          },
        ],
        "OK",
      ),
    );

    await expect(findAddressByCoords(37.6586, 126.9779)).resolves.toBe(
      "경기 고양시 덕양구 북한동 산 1-1",
    );
  });

  it("요청이 끊겨 OK가 아닌 상태로 콜백이 오면 null이다", async () => {
    stubKakao((callback) => callback([], null));

    await expect(findAddressByCoords(37.56575, 126.96664)).resolves.toBeNull();
  });

  it("응답이 오지 않으면 정해진 시간 뒤 null이다", async () => {
    stubKakao(() => {});

    const pending = findAddressByCoords(37.56575, 126.96664);
    await vi.advanceTimersByTimeAsync(FIND_ADDRESS_TIMEOUT_MS);

    await expect(pending).resolves.toBeNull();
  });

  it("SDK가 없으면 reject한다", async () => {
    vi.stubGlobal("window", {});

    await expect(findAddressByCoords(37.56575, 126.96664)).rejects.toThrow(
      "KAKAO_SERVICES_UNAVAILABLE",
    );
  });
});
