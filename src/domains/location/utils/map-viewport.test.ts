import { describe, expect, it } from "vitest";
import {
  getMapFit,
  getMapFitPadding,
  getPinFitPadding,
  getRevealAnchorY,
  getVisibleCenterOffsetY,
  isAnchoredBoxHidden,
} from "@/domains/location/utils/map-viewport";

describe("getVisibleCenterOffsetY", () => {
  it("pushes the map center below the target so it lands in the strip the sheet leaves open", () => {
    // 지도 745px, 시트 530px → 노출 영역은 위쪽 215px, 그 한가운데는 107.5px.
    // 지도 중심은 372.5px에 그려지므로 대상보다 265px 아래를 중심으로 잡아야 한다.
    expect(
      getVisibleCenterOffsetY({
        mapHeight: 745,
        sheetHeight: 530,
        targetOffsetY: 400,
      }),
    ).toBe(665);
  });

  it("leaves the target centered when no sheet covers the map", () => {
    expect(
      getVisibleCenterOffsetY({
        mapHeight: 745,
        sheetHeight: 0,
        targetOffsetY: 400,
      }),
    ).toBe(400);
  });

  it("gives up on correcting when the sheet covers the whole map", () => {
    expect(
      getVisibleCenterOffsetY({
        mapHeight: 500,
        sheetHeight: 500,
        targetOffsetY: 400,
      }),
    ).toBe(400);
  });

  it("ignores a map height that is not measurable yet", () => {
    expect(
      getVisibleCenterOffsetY({
        mapHeight: 0,
        sheetHeight: 530,
        targetOffsetY: 400,
      }),
    ).toBe(400);
  });
});

describe("getMapFitPadding", () => {
  it("keeps the designed padding when the sheet leaves plenty of map", () => {
    expect(getMapFitPadding({ mapHeight: 844, sheetHeight: 530 })).toEqual({
      top: 80,
      bottom: 550,
      left: 20,
      right: 20,
    });
  });

  it("keeps a floor under the bottom padding so markers clear a shallow sheet", () => {
    expect(getMapFitPadding({ mapHeight: 844, sheetHeight: 0 })?.bottom).toBe(
      140,
    );
  });

  it("gives up refitting when the sheet leaves no usable band", () => {
    // full 스냅(743px)이면 위에 81px만 남는다. 여기에 맞추면 마커가
    // 알아볼 수 없이 축소되므로 마지막 프레이밍을 그대로 둔다.
    expect(getMapFitPadding({ mapHeight: 844, sheetHeight: 743 })).toBeNull();
  });

  it("trims the top padding instead of giving up on a short screen", () => {
    // 667px 기기에서 시트 500px → 위 여백 147px. 상단 패딩을 줄여서라도 맞춘다.
    expect(getMapFitPadding({ mapHeight: 667, sheetHeight: 500 })).toEqual({
      top: 27,
      bottom: 520,
      left: 20,
      right: 20,
    });
  });

  it("still returns padding before the map is measurable", () => {
    expect(getMapFitPadding({ mapHeight: 0, sheetHeight: 530 })).toEqual({
      top: 80,
      bottom: 550,
      left: 20,
      right: 20,
    });
  });
});

describe("getPinFitPadding", () => {
  it("좌표 위로 비울 높이를 따로 세므로 위에는 화면 끝과의 틈 8px만 둔다", () => {
    expect(getPinFitPadding({ mapHeight: 812, sheetHeight: 528 })).toEqual({
      top: 8,
      bottom: 548,
      left: 20,
      right: 20,
    });
  });

  it("시트가 지도를 거의 다 덮어 맞출 여지가 없으면 null이다", () => {
    expect(getPinFitPadding({ mapHeight: 844, sheetHeight: 743 })).toBeNull();
  });
});

describe("getMapFit", () => {
  // 375x812에서 시트가 중간(528px)일 때의 여백. 띠는 335x256px다(위에서 8px부터 264px까지).
  const padding = { top: 8, bottom: 548, left: 20, right: 20 };
  const fit = (
    pins: { x: number; y: number; above: number }[],
    over: Partial<Parameters<typeof getMapFit>[0]> = {},
  ) =>
    getMapFit({
      pins,
      zoom: 16,
      mapWidth: 375,
      mapHeight: 812,
      padding,
      maxZoom: 16,
      ...over,
    });
  const station = { x: 0, y: 0, above: 91 };
  const place = (x: number, y: number) => ({ x, y, above: 80 });

  it("역이 맨 위면 이름표 높이(91px)까지 띠에 들어가는 단계를 고른다", () => {
    // 91 + 165 = 256px로 딱 들어간다.
    expect(fit([station, place(0, 165)])?.zoom).toBe(16);
    // 1px만 넘어도 한 단계 축소한다. 좌표 사이는 절반이 되고 이름표는 그대로다(91 + 83px).
    expect(fit([station, place(0, 166)])?.zoom).toBe(15);
  });

  it("장소가 맨 위면 장소 위로 비울 높이(80px)를 센다", () => {
    // 역은 아래에 있어 이름표(91px)가 장소 위보다 아래에서 시작한다. 80 + 176 = 256px.
    expect(fit([station, place(0, -176)])?.zoom).toBe(16);
    expect(fit([station, place(0, -177)])?.zoom).toBe(15);
  });

  it("너비가 더 빠듯하면 너비에 맞춘다", () => {
    expect(fit([station, place(335, 0)])?.zoom).toBe(16);
    expect(fit([station, place(336, 0)])?.zoom).toBe(15);
  });

  it("상자가 작으면 확대하되 가장 큰 단계를 넘지 않는다", () => {
    expect(fit([station, place(10, 20)], { zoom: 14 })?.zoom).toBe(16);
    expect(fit([station, place(0, 0)], { zoom: 12 })?.zoom).toBe(16);
  });

  it("핀들의 상자를 띠의 가운데에 두도록 좌표들의 한가운데 자리를 정한다", () => {
    // 상자는 y -91부터 100까지라 가운데가 4.5, 좌표들의 한가운데는 50이다. 띠의 가운데 136px보다 45.5px 아래.
    expect(fit([station, place(0, 100)])?.anchorY).toBe(136 + 45.5);
    // 그 자리에 두면 맨 위 이름표는 136 - 95.5 = 40.5px, 맨 아래 좌표는 231.5px다.
  });

  it("띠가 핀보다 낮아 담을 수 없으면 끝없이 축소하지 않고 멈춘다", () => {
    // iPhone SE에서 시트가 많이 올라온 경우처럼 띠가 60px다. 역 이름표(91px)는 어느 단계에서도 들어가지 않는다.
    expect(fit([station, place(0, 10)], { mapHeight: 616 })?.zoom).toBe(6);
  });

  it("주소창이 있는 휴대폰 높이에서도 역 이름표가 화면 안에 들어온다", () => {
    // 2026-11-23 시뮬레이터에서 잰 화면: iPhone SE 547px, iPhone 16 659px, iPhone 17 Pro 714px. 시트는 화면의 65%다.
    // 회의실 대역처럼 장소가 역 남쪽으로 16단계에서 141px 떨어져 있다.
    for (const mapHeight of [547, 659, 714]) {
      const sheetHeight = Math.round(mapHeight * 0.65);
      const pinPadding = getPinFitPadding({ mapHeight, sheetHeight });
      if (!pinPadding) throw new Error("여백 없음");
      const pins = [station, place(-62, 53), place(90, 141)];
      const result = fit(pins, { mapHeight, padding: pinPadding });
      if (!result) throw new Error("맞추지 못함");

      const ratio = 2 ** (result.zoom - 16);
      const middleY = (141 * ratio) / 2;
      const labelTop = result.anchorY - middleY - station.above;
      const lowest = result.anchorY + middleY;
      expect(labelTop).toBeGreaterThanOrEqual(0);
      expect(lowest).toBeLessThanOrEqual(mapHeight - sheetHeight - 20);
    }
  });

  it("띠가 없거나(지도를 아직 재지 못함) 담을 핀이 없으면 고를 수 없다", () => {
    expect(fit([station], { mapHeight: 0 })).toBeNull();
    expect(fit([])).toBeNull();
  });
});

describe("isAnchoredBoxHidden", () => {
  // 375x812 지도, 시트 peek(255px). 시트 위 영역은 y 0부터 557px까지다. 상자는 고른 장소의 이름표와 큰 핀(폭 120, 높이 90).
  const base = {
    boxWidth: 120,
    boxHeight: 90,
    mapWidth: 375,
    mapHeight: 812,
    sheetHeight: 255,
  };

  it("상자가 시트 위 영역 안에 다 들어오면 걸리지 않았다", () => {
    expect(isAnchoredBoxHidden({ ...base, anchorX: 188, anchorY: 300 })).toBe(
      false,
    );
    // 가장자리에 딱 붙은 것은 보이는 것으로 본다.
    expect(isAnchoredBoxHidden({ ...base, anchorX: 60, anchorY: 90 })).toBe(
      false,
    );
    expect(isAnchoredBoxHidden({ ...base, anchorX: 315, anchorY: 557 })).toBe(
      false,
    );
  });

  it("이름표 위쪽이 화면 위로 나가면 걸렸다(장소가 역보다 위에 있을 때)", () => {
    expect(isAnchoredBoxHidden({ ...base, anchorX: 188, anchorY: 80 })).toBe(
      true,
    );
  });

  it("이름표가 화면 옆 끝을 넘으면 걸렸다", () => {
    expect(isAnchoredBoxHidden({ ...base, anchorX: 40, anchorY: 300 })).toBe(
      true,
    );
    expect(isAnchoredBoxHidden({ ...base, anchorX: 340, anchorY: 300 })).toBe(
      true,
    );
  });

  it("좌표가 시트 윗변보다 아래면 걸렸다", () => {
    expect(isAnchoredBoxHidden({ ...base, anchorX: 188, anchorY: 600 })).toBe(
      true,
    );
  });
});

describe("getRevealAnchorY", () => {
  it("남은 영역이 넉넉하면 좌표를 그 영역의 가운데에 둔다", () => {
    // 지도 812px, 시트 223px → 남은 영역 589px, 가운데 294.5px. 상자 115px는 위로 넘치지 않는다.
    expect(
      getRevealAnchorY({ mapHeight: 812, sheetHeight: 223, boxHeight: 115 }),
    ).toBe(294.5);
  });

  it("가운데에 두면 상자 위쪽이 화면 밖으로 나가면, 상자가 다 들어가는 자리까지 내린다", () => {
    // CodeRabbit 예: 지도 667px, 시트 500px → 남은 영역 167px, 가운데 83.5px. 상자 90px를 가운데에 두면 위가 -6.5px.
    expect(
      getRevealAnchorY({ mapHeight: 667, sheetHeight: 500, boxHeight: 90 }),
    ).toBe(90);
  });

  it("남은 영역이 상자보다 낮으면 다 보이게 할 수 없어 가운데에 둔다", () => {
    expect(
      getRevealAnchorY({ mapHeight: 667, sheetHeight: 600, boxHeight: 90 }),
    ).toBe(33.5);
  });
});
