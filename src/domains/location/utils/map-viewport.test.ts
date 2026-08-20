import { describe, expect, it } from "vitest";
import { getVisibleCenterOffsetY } from "@/domains/location/utils/map-viewport";

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
