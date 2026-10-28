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
