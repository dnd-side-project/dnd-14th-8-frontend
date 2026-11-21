import { describe, expect, it } from "vitest";
import {
  getMapFitPadding,
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
