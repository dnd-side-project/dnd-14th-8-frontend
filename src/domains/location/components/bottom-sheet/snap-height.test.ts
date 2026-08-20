import { describe, expect, it } from "vitest";
import { getSheetHeightBySnap } from "@/domains/location/components/bottom-sheet/snap-height";

// 디자인 기준 높이: 콘텐츠 219/494/711 + 핸들 36 = 255/530/747
const DESIGN_VIEWPORT = 844;

describe("getSheetHeightBySnap", () => {
  it("keeps the designed heights on the viewport they were drawn for", () => {
    expect(getSheetHeightBySnap("peek", DESIGN_VIEWPORT)).toBe(255);
    expect(getSheetHeightBySnap("half", DESIGN_VIEWPORT)).toBe(530);
  });

  it("never lets the sheet outgrow the viewport and push the drag handle off screen", () => {
    // iPhone SE(667px)에서 full은 디자인값 747px이라 뷰포트를 80px 넘겼다.
    expect(getSheetHeightBySnap("full", 667)).toBeLessThan(667);
  });

  it("leaves usable map on small screens by clamping half", () => {
    // 667px에서 디자인값 530px이면 지도가 137px밖에 안 남는다.
    expect(getSheetHeightBySnap("half", 667)).toBeLessThan(530);
    expect(667 - getSheetHeightBySnap("half", 667)).toBeGreaterThan(200);
  });

  it("keeps snaps ordered so dragging between them stays monotonic", () => {
    for (const viewport of [667, 745, 844]) {
      expect(getSheetHeightBySnap("peek", viewport)).toBeLessThan(
        getSheetHeightBySnap("half", viewport),
      );
      expect(getSheetHeightBySnap("half", viewport)).toBeLessThan(
        getSheetHeightBySnap("full", viewport),
      );
    }
  });

  it("falls back to the designed height before the viewport is measurable", () => {
    expect(getSheetHeightBySnap("half", 0)).toBe(530);
  });
});
