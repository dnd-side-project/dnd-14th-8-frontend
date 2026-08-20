export type SheetSnap = "full" | "half" | "peek";

const HANDLE_HEIGHT_PX = 36;

/** 디자인 시안(375x844) 기준 콘텐츠 높이. */
const SNAP_CONTENT_HEIGHT_PX: Record<SheetSnap, number> = {
  peek: 219,
  half: 494,
  full: 711,
};

/**
 * 시안 기준 높이를 그대로 쓰면 작은 기기에서 지도가 거의 남지 않고,
 * full은 뷰포트를 넘겨 드래그 핸들이 화면 밖으로 밀린다. 뷰포트 비율로
 * 상한을 걸어 시안 기기에서는 원래 높이를, 작은 기기에서는 줄인 높이를 쓴다.
 */
const SNAP_MAX_VIEWPORT_RATIO: Record<SheetSnap, number> = {
  peek: 0.4,
  half: 0.65,
  full: 0.88,
};

export function getSheetHeightBySnap(snap: SheetSnap, viewportHeight: number) {
  const designHeight = SNAP_CONTENT_HEIGHT_PX[snap] + HANDLE_HEIGHT_PX;

  if (viewportHeight <= 0) {
    return designHeight;
  }

  return Math.round(
    Math.min(designHeight, viewportHeight * SNAP_MAX_VIEWPORT_RATIO[snap]),
  );
}
