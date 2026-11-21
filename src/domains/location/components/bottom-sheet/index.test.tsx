// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BottomSheet } from ".";
import { getSheetHeightBySnap, type SheetSnap } from "./snap-height";

// jsdom은 레이아웃이 없어 컨테이너 높이를 재지 못한다(0). 그때 시트는 시안 기준 높이를 쓴다.
const PEEK = getSheetHeightBySnap("peek", 0);
const HALF = getSheetHeightBySnap("half", 0);

function sheetOf(container: HTMLElement) {
  const sheet = container.firstElementChild;
  if (!(sheet instanceof HTMLElement)) throw new Error("시트 없음");
  return sheet;
}

function renderSheet(props: {
  snap?: SheetSnap;
  defaultSnap?: SheetSnap;
  peekContentHeight?: number;
}) {
  const onHeightChange = vi.fn();
  const utils = render(
    <BottomSheet {...props} onHeightChange={onHeightChange}>
      <p>내용</p>
    </BottomSheet>,
  );
  return { ...utils, onHeightChange };
}

afterEach(() => {
  cleanup();
});

describe("BottomSheet snap", () => {
  it("snap을 넘기면 그 스냅 높이로 시작한다", () => {
    const { container, onHeightChange } = renderSheet({ snap: "peek" });

    expect(sheetOf(container).style.height).toBe(`${PEEK}px`);
    expect(onHeightChange).toHaveBeenLastCalledWith(PEEK);
  });

  it("snap이 바뀌면 그 높이로 옮기고 새 높이를 알린다", () => {
    const { container, onHeightChange, rerender } = renderSheet({
      snap: "half",
    });
    expect(sheetOf(container).style.height).toBe(`${HALF}px`);

    rerender(
      <BottomSheet snap="peek" onHeightChange={onHeightChange}>
        <p>내용</p>
      </BottomSheet>,
    );
    expect(sheetOf(container).style.height).toBe(`${PEEK}px`);
    expect(onHeightChange).toHaveBeenLastCalledWith(PEEK);

    rerender(
      <BottomSheet snap="half" onHeightChange={onHeightChange}>
        <p>내용</p>
      </BottomSheet>,
    );
    expect(sheetOf(container).style.height).toBe(`${HALF}px`);
    expect(onHeightChange).toHaveBeenLastCalledWith(HALF);
  });

  it("snap이 없으면 defaultSnap 높이로 시작한다", () => {
    const { container } = renderSheet({ defaultSnap: "peek" });

    expect(sheetOf(container).style.height).toBe(`${PEEK}px`);
  });

  it("peekContentHeight를 넘기면 peek을 손잡이 36px + 그 높이에 맞추고, 바뀌면 바로 따라간다(#271)", () => {
    const { container, onHeightChange, rerender } = renderSheet({
      snap: "peek",
      peekContentHeight: 160,
    });
    expect(sheetOf(container).style.height).toBe("196px");
    expect(onHeightChange).toHaveBeenLastCalledWith(196);

    rerender(
      <BottomSheet
        snap="peek"
        peekContentHeight={140}
        onHeightChange={onHeightChange}
      >
        <p>내용</p>
      </BottomSheet>,
    );
    expect(sheetOf(container).style.height).toBe("176px");
    expect(onHeightChange).toHaveBeenLastCalledWith(176);
  });

  it("peekContentHeight는 peek에만 쓰고 half 높이는 바꾸지 않는다", () => {
    const { container } = renderSheet({ snap: "half", peekContentHeight: 160 });

    expect(sheetOf(container).style.height).toBe(`${HALF}px`);
  });
});
