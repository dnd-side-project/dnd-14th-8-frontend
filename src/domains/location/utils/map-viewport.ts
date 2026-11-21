interface VisibleCenterOffsetParams {
  /** 지도 컨테이너의 전체 높이(px). */
  mapHeight: number;
  /** 지도 위를 덮고 있는 바텀시트의 높이(px). */
  sheetHeight: number;
  /** 화면 가운데로 보내고 싶은 좌표의 픽셀 오프셋 y. */
  targetOffsetY: number;
}

/**
 * 지도 중심으로 삼을 픽셀 오프셋 y를 계산한다.
 *
 * 지도 API는 중심 좌표를 컨테이너 정중앙에 그리는데, 바텀시트가 아래를 덮고
 * 있으면 그 정중앙이 시트 뒤에 숨는다. 시트 절반만큼 아래를 중심으로 잡아야
 * 대상이 시트가 비워둔 영역의 한가운데로 올라온다.
 */
export function getVisibleCenterOffsetY({
  mapHeight,
  sheetHeight,
  targetOffsetY,
}: VisibleCenterOffsetParams): number {
  // 아직 측정되지 않았거나 시트가 지도를 전부 덮으면 보정할 여지가 없다.
  if (mapHeight <= 0 || sheetHeight <= 0 || sheetHeight >= mapHeight) {
    return targetOffsetY;
  }

  return targetOffsetY + sheetHeight / 2;
}

export interface MapFitPadding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const FIT_TOP_PADDING_PX = 80;
const FIT_SIDE_PADDING_PX = 20;
/** 마커가 시트 모서리에 딱 붙지 않도록 두는 여유. */
const FIT_SHEET_GAP_PX = 20;
const FIT_MIN_BOTTOM_PADDING_PX = 140;
/** 이보다 좁은 띠에 억지로 맞추면 마커가 알아볼 수 없게 축소된다. */
const FIT_MIN_BAND_PX = 120;

/**
 * fitBounds에 넘길 패딩. 시트가 지도를 거의 다 덮어 맞출 여지가 없으면
 * null을 돌려주고, 그때는 마지막 프레이밍을 그대로 두는 편이 낫다.
 */
export function getMapFitPadding({
  mapHeight,
  sheetHeight,
}: {
  mapHeight: number;
  sheetHeight: number;
}): MapFitPadding | null {
  const bottom = Math.max(
    sheetHeight + FIT_SHEET_GAP_PX,
    FIT_MIN_BOTTOM_PADDING_PX,
  );
  const side = FIT_SIDE_PADDING_PX;

  // 아직 지도를 재지 못했으면 좁은지 판단할 수 없으니 그냥 맞춘다.
  if (mapHeight <= 0) {
    return { top: FIT_TOP_PADDING_PX, bottom, left: side, right: side };
  }

  const available = mapHeight - bottom;
  if (available < FIT_MIN_BAND_PX) {
    return null;
  }

  return {
    top: Math.min(FIT_TOP_PADDING_PX, available - FIT_MIN_BAND_PX),
    bottom,
    left: side,
    right: side,
  };
}

/**
 * 좌표에 아래 가운데를 맞춘 상자(핀과 이름표)가 시트 위 영역 밖으로 걸리는지 본다(#271).
 * 자리는 지도 컨테이너 왼쪽 위에서 잰 px다. 상자가 조금이라도 화면 위나 양옆 끝을 넘거나,
 * 좌표가 시트 윗변보다 아래에 있으면 걸린 것이다.
 */
/**
 * 아래 가운데를 좌표에 맞춘 상자(핀과 이름표)를 시트가 비워 둔 영역에 보일 때, 좌표(상자 아래 끝)를 둘
 * 세로 자리(컨테이너 위에서 px, #271). 기본은 그 영역의 가운데다. 영역이 상자 높이의 두 배보다 낮으면 가운데에
 * 두었을 때 상자 위쪽이 화면 밖으로 나가므로, 상자가 다 들어가는 자리(상자 높이)까지 내린다. 영역이 상자보다
 * 낮으면 어디에 두어도 다 보이지 않으니 가운데에 둔다.
 */
export function getRevealAnchorY({
  mapHeight,
  sheetHeight,
  boxHeight,
}: {
  mapHeight: number;
  sheetHeight: number;
  boxHeight: number;
}): number {
  const visibleHeight = mapHeight - sheetHeight;
  const visibleCenter = visibleHeight / 2;

  if (boxHeight > visibleHeight) return visibleCenter;

  return Math.max(visibleCenter, boxHeight);
}

export function isAnchoredBoxHidden({
  anchorX,
  anchorY,
  boxWidth,
  boxHeight,
  mapWidth,
  mapHeight,
  sheetHeight,
}: {
  /** 상자 아래 가운데(좌표)의 자리 */
  anchorX: number;
  anchorY: number;
  boxWidth: number;
  boxHeight: number;
  mapWidth: number;
  mapHeight: number;
  /** 지도 위를 덮고 있는 바텀시트의 높이(px). */
  sheetHeight: number;
}): boolean {
  const left = anchorX - boxWidth / 2;
  const right = anchorX + boxWidth / 2;
  const top = anchorY - boxHeight;

  return (
    left < 0 || right > mapWidth || top < 0 || anchorY > mapHeight - sheetHeight
  );
}
