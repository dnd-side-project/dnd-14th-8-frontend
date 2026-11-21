// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { revealAnchoredBox } from "@/domains/location/utils/pan-to-visible-center";

/** 1px = 위도, 경도 0.00001도인 대역 지도. 중심은 컨테이너 한가운데에 그려진다. */
function createFakeMap({ width, height }: { width: number; height: number }) {
  const center = { lat: 37.56, lng: 126.99 };
  class LatLng {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number) {
      this.lat = lat;
      this.lng = lng;
    }
  }
  (window as unknown as { naver: unknown }).naver = {
    maps: {
      LatLng,
      Point: class {
        x: number;
        y: number;
        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
        }
      },
    },
  };
  const toOffset = (coord: { lat: number; lng: number }) => ({
    x: (coord.lng - 126.9) * 100000,
    y: (37.6 - coord.lat) * 100000,
  });

  return {
    getSize: () => ({ width, height }),
    getCenter: () => new LatLng(center.lat, center.lng),
    getProjection: () => ({
      fromCoordToOffset: toOffset,
      fromOffsetToCoord: (point: { x: number; y: number }) =>
        new LatLng(37.6 - point.y / 100000, 126.9 + point.x / 100000),
    }),
    panTo: vi.fn(),
    setCenter: vi.fn(),
    /** 지도 중심을 target으로 옮겼을 때 좌표가 컨테이너 위에서 그려지는 자리(px). */
    screenYAfterPan(target: { lat: number }, latitude: number) {
      return height / 2 + (target.lat - latitude) * 100000;
    },
  };
}

afterEach(() => {
  delete (window as unknown as { naver?: unknown }).naver;
});

describe("revealAnchoredBox", () => {
  it("남은 영역이 좁아도 상자(핀과 이름표) 위쪽이 화면 밖에 남지 않게 옮긴다", () => {
    // CodeRabbit 예: 지도 667px, 시트 500px, 상자 90px. 장소는 지도 중심보다 400px 위라 가려져 있다.
    const map = createFakeMap({ width: 375, height: 667 });
    const latitude = 37.56 + 0.004;

    const moved = revealAnchoredBox({
      latitude,
      longitude: 126.99,
      boxWidth: 120,
      boxHeight: 90,
      mapInst: map as unknown as naver.maps.Map,
      sheetHeight: 500,
    });

    expect(moved).toBe(true);
    const [target] = map.panTo.mock.calls[0] as [{ lat: number }];
    const anchorY = map.screenYAfterPan(target, latitude);
    // 좌표(상자 아래 끝)가 90px에 와서 상자 위쪽이 0px이다. 가운데(83.5px)였다면 -6.5px가 잘린다.
    expect(anchorY).toBeCloseTo(90, 6);
    expect(anchorY - 90).toBeGreaterThanOrEqual(0);
    expect(anchorY).toBeLessThanOrEqual(667 - 500);
  });

  it("남은 영역이 넉넉하면 지금처럼 가운데로 옮긴다", () => {
    const map = createFakeMap({ width: 375, height: 812 });
    const latitude = 37.56 + 0.005;

    revealAnchoredBox({
      latitude,
      longitude: 126.99,
      boxWidth: 120,
      boxHeight: 115,
      mapInst: map as unknown as naver.maps.Map,
      sheetHeight: 223,
    });

    const [target] = map.panTo.mock.calls[0] as [{ lat: number }];
    expect(map.screenYAfterPan(target, latitude)).toBeCloseTo(
      (812 - 223) / 2,
      6,
    );
  });
});
