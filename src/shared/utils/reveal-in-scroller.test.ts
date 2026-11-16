import { describe, expect, it } from "vitest";
import { getScrollLeftToReveal } from "@/shared/utils/reveal-in-scroller";

// 보이는 폭 300px, 지금 100px만큼 스크롤된 줄. 보이는 범위는 100~400이다.
const view = { scrollLeft: 100, viewportWidth: 300 };

describe("getScrollLeftToReveal", () => {
  it("does not scroll when the item is fully visible", () => {
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 150, itemEnd: 200 }),
    ).toBeNull();
  });

  it("aligns the end when the item is partly hidden on the right", () => {
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 380, itemEnd: 430 }),
    ).toBe(130);
  });

  it("aligns the end when the item is fully hidden on the right", () => {
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 500, itemEnd: 550 }),
    ).toBe(250);
  });

  it("aligns the start when the item is partly hidden on the left", () => {
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 80, itemEnd: 130 }),
    ).toBe(80);
  });

  it("aligns the start when the item is fully hidden on the left", () => {
    expect(getScrollLeftToReveal({ ...view, itemStart: 10, itemEnd: 60 })).toBe(
      10,
    );
  });

  it("keeps the margin visible on both sides", () => {
    // 칩은 다 보이지만 오른쪽 링 4px가 밖으로 나간다.
    expect(
      getScrollLeftToReveal({
        ...view,
        itemStart: 340,
        itemEnd: 398,
        margin: 4,
      }),
    ).toBe(102);
    // 왼쪽 링 4px가 밖으로 나간다.
    expect(
      getScrollLeftToReveal({
        ...view,
        itemStart: 102,
        itemEnd: 150,
        margin: 4,
      }),
    ).toBe(98);
    // 링까지 들어오면 움직이지 않는다.
    expect(
      getScrollLeftToReveal({
        ...view,
        itemStart: 104,
        itemEnd: 396,
        margin: 4,
      }),
    ).toBeNull();
  });

  it("rounds away from the item so a fractional edge is not cut by 1px", () => {
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 380.4, itemEnd: 430.6 }),
    ).toBe(131);
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 80.6, itemEnd: 130 }),
    ).toBe(80);
  });

  it("aligns the start when the item is wider than the view", () => {
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 120, itemEnd: 500 }),
    ).toBe(120);
    expect(
      getScrollLeftToReveal({ ...view, itemStart: 100, itemEnd: 500 }),
    ).toBeNull();
  });

  describe("align center", () => {
    const center = { ...view, align: "center" as const };

    it("does not scroll when the item is fully visible", () => {
      expect(
        getScrollLeftToReveal({ ...center, itemStart: 150, itemEnd: 200 }),
      ).toBeNull();
    });

    it("centers the item when it is hidden or partly hidden", () => {
      // 가운데(475)를 보이는 폭의 절반(150)만큼 왼쪽에서 본다.
      expect(
        getScrollLeftToReveal({ ...center, itemStart: 450, itemEnd: 500 }),
      ).toBe(325);
      expect(
        getScrollLeftToReveal({ ...center, itemStart: 380, itemEnd: 430 }),
      ).toBe(255);
      expect(
        getScrollLeftToReveal({ ...center, itemStart: 60, itemEnd: 110 }),
      ).toBe(0);
    });

    it("stops at 0 for an item near the start", () => {
      expect(
        getScrollLeftToReveal({
          ...center,
          scrollLeft: 300,
          itemStart: 20,
          itemEnd: 70,
        }),
      ).toBe(0);
    });
  });
});
