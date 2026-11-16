/** 디자인 시스템 포커스 링이 칩 테두리 밖으로 나가는 폭(두께 2px + 간격 2px). */
export const FOCUS_RING_SPACE = 4;

export interface ScrollLeftToRevealParams {
  /** 지금 가로 스크롤 위치 */
  scrollLeft: number;
  /** 스크롤 영역에 보이는 폭(clientWidth) */
  viewportWidth: number;
  /** 항목의 시작과 끝. 스크롤 내용의 왼쪽 끝에서 잰 값이다. */
  itemStart: number;
  itemEnd: number;
  /** 항목 앞뒤로 함께 보여야 하는 폭 */
  margin?: number;
  /**
   * 다 보이지 않을 때 어디로 옮길지.
   * nearest: 가까운 쪽 끝에 겨우 들어오게(키보드로 칩을 넘길 때 줄이 크게 움직이지 않게).
   * center: 가운데로(양옆 항목도 함께 보이게).
   */
  align?: "nearest" | "center";
}

/**
 * 항목이 앞뒤 margin까지 다 보이게 하는 scrollLeft를 돌려준다. 이미 다 보이면 null.
 * 브라우저가 정수로 맞추며 1px이 모자라지 않게, 왼쪽은 내리고 오른쪽은 올린다.
 */
export function getScrollLeftToReveal({
  scrollLeft,
  viewportWidth,
  itemStart,
  itemEnd,
  margin = 0,
  align = "nearest",
}: ScrollLeftToRevealParams): number | null {
  const start = itemStart - margin;
  const end = itemEnd + margin;
  const fullyVisible = start >= scrollLeft && end <= scrollLeft + viewportWidth;

  if (align === "center") {
    if (fullyVisible) return null;
    // 앞쪽 항목은 가운데까지 못 오니 0에서 멈춘다. 끝쪽은 브라우저가 최대값에서 멈춘다.
    return Math.max(
      0,
      Math.round((itemStart + itemEnd) / 2 - viewportWidth / 2),
    );
  }

  // 화면보다 넓으면 끝까지 다 보일 수 없으니 시작을 맞춘다.
  if (start < scrollLeft || end - start > viewportWidth) {
    return start === scrollLeft ? null : Math.floor(start);
  }
  if (end > scrollLeft + viewportWidth) {
    return Math.ceil(end - viewportWidth);
  }
  return null;
}

/** item이 margin까지 다 보이도록 scroller를 가로로만 스크롤한다. 세로 위치와 바깥 스크롤은 건드리지 않는다. */
export function revealInScroller(
  scroller: HTMLElement,
  item: HTMLElement,
  {
    margin = 0,
    align = "nearest",
  }: Pick<ScrollLeftToRevealParams, "margin" | "align"> = {},
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const itemStart =
    itemRect.left -
    scrollerRect.left -
    scroller.clientLeft +
    scroller.scrollLeft;
  const next = getScrollLeftToReveal({
    scrollLeft: scroller.scrollLeft,
    viewportWidth: scroller.clientWidth,
    itemStart,
    itemEnd: itemStart + itemRect.width,
    margin,
    align,
  });
  if (next !== null) scroller.scrollLeft = next;
}

/**
 * 가로 스크롤 칩 줄에 키보드로 포커스한 칩이 링까지 다 보이게, 줄만 가로로 스크롤하는 리스너를 단다.
 * 브라우저는 일부라도 보이는 칩에 포커스하면 스크롤하지 않아, 칩이 화면 밖에 걸린 채 남는다.
 * 터치와 마우스로 누를 때는(:focus-visible이 아님) 줄을 움직이지 않는다.
 *
 * 칩 줄의 ref에 그대로 넘긴다(`ref={attachRevealFocusedChip}`). 돌려준 함수로 리스너를 뗀다.
 * div에 onFocus를 달면 Biome의 noStaticElementInteractions에 걸리고,
 * role을 주면 화면 읽기 기능이 읽는 내용이 바뀌어 DOM 리스너로 단다.
 */
export function attachRevealFocusedChip(scroller: HTMLElement | null) {
  if (!scroller) return;
  const onFocusIn = (event: FocusEvent) => {
    const item = event.target;
    if (!(item instanceof HTMLElement) || item === scroller) return;
    if (!item.matches(":focus-visible")) return;
    revealInScroller(scroller, item, { margin: FOCUS_RING_SPACE });
  };
  scroller.addEventListener("focusin", onFocusIn);
  return () => scroller.removeEventListener("focusin", onFocusIn);
}
