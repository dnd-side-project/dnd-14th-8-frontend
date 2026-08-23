import { describe, expect, it } from "vitest";
import {
  getMapFitPadding,
  getVisibleCenterOffsetY,
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
