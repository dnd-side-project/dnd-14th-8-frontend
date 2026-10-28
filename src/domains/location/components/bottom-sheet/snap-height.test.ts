import { describe, expect, it } from "vitest";
import {
  getNearestSnap,
  getSheetHeightBySnap,
} from "@/domains/location/components/bottom-sheet/snap-height";

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

describe("getNearestSnap", () => {
  it("settles on the snap the drag ended closest to", () => {
    // 844px 기준 스냅 높이는 255/530/743.
    expect(getNearestSnap(300, DESIGN_VIEWPORT)).toBe("peek");
    expect(getNearestSnap(600, DESIGN_VIEWPORT)).toBe("half");
    expect(getNearestSnap(700, DESIGN_VIEWPORT)).toBe("full");
  });

  it("picks the lower snap when the drag ends exactly between two", () => {
    // 255와 530의 중간은 392.5. 애매하면 지도를 더 보여주는 쪽으로 내린다.
    expect(getNearestSnap(392, DESIGN_VIEWPORT)).toBe("peek");
  });

  it("still settles before the viewport is measurable", () => {
    expect(getNearestSnap(530, 0)).toBe("half");
  });
});
