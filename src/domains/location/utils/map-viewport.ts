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

/** 좌표 위로 비울 높이를 따로 세는 맞춤(getMapFit)에서, 그 위와 화면 위 끝 사이에 두는 틈. */
const FIT_PIN_TOP_GAP_PX = 8;
/** 맞출 때 내려갈 수 있는 가장 작은 확대 단계. 비울 높이는 축소해도 줄지 않아, 띠가 그보다 낮으면 끝없이 축소하게 된다. */
const MIN_FIT_ZOOM = 6;

/**
 * 좌표 위로 비울 높이를 따로 세는 맞춤(getMapFit)에 쓰는 여백. 위에는 화면 끝과의 틈만 둔다.
 * 맞출 여지가 없으면 getMapFitPadding처럼 null이다.
 */
export function getPinFitPadding(params: {
  mapHeight: number;
  sheetHeight: number;
}): MapFitPadding | null {
  const padding = getMapFitPadding(params);

  return padding && { ...padding, top: FIT_PIN_TOP_GAP_PX };
}

/** 지도에 담을 핀. 좌표의 자리(px, 지금 확대 단계)와, 좌표 위로 비워 둘 높이(px)다. */
export interface FitPin {
  x: number;
  y: number;
  above: number;
}

export interface MapFit {
  /** 핀과 비울 높이가 여백 안쪽 띠에 다 들어가는 가장 큰 확대 단계 */
  zoom: number;
  /** 좌표들의 한가운데를 둘 세로 자리(컨테이너 위에서 px) */
  anchorY: number;
}

/**
 * 핀들을 여백 안쪽 띠에 담는 확대 단계와 자리를 고른다(#275). 띠가 없으면(지도를 아직 재지 못함) null이다.
 *
 * 좌표만 담으면 좌표 위로 그려지는 핀이 잘린다. 역 이름표는 좌표 위로 91px라 여백 80px로는 모자라서,
 * 주소창이 있는 휴대폰 높이(547px에서 714px)에서 역이 맨 위일 때 이름표가 화면 위로 잘렸다. 그래서 핀마다
 * 위로 비울 높이를 세어 띠에 들어가는지 보고, 그 상자를 띠의 가운데에 둔다.
 * 네이버 fitBounds는 위아래 여백이 크게 다르면 넘긴 여백을 다 지키지 않아 쓰지 않는다.
 * 좌표 사이 거리는 확대 단계마다 두 배가 되고 비울 높이는 그대로다.
 */
export function getMapFit({
  pins,
  zoom,
  mapWidth,
  mapHeight,
  padding,
  maxZoom,
}: {
  pins: FitPin[];
  /** 지금 확대 단계. 핀의 x, y를 잰 단계다 */
  zoom: number;
  mapWidth: number;
  mapHeight: number;
  padding: MapFitPadding;
  maxZoom: number;
}): MapFit | null {
  const bandWidth = mapWidth - padding.left - padding.right;
  const bandHeight = mapHeight - padding.top - padding.bottom;
  if (pins.length === 0 || bandWidth <= 0 || bandHeight <= 0) return null;

  const measure = (candidate: number) => {
    const ratio = 2 ** (candidate - zoom);
    const xs = pins.map((pin) => pin.x * ratio);
    const ys = pins.map((pin) => pin.y * ratio);

    return {
      width: Math.max(...xs) - Math.min(...xs),
      top: Math.min(...pins.map((pin, index) => ys[index] - pin.above)),
      bottom: Math.max(...ys),
      middleY: (Math.min(...ys) + Math.max(...ys)) / 2,
    };
  };

  let fitZoom = maxZoom;
  let box = measure(fitZoom);
  while (
    fitZoom > MIN_FIT_ZOOM &&
    (box.width > bandWidth || box.bottom - box.top > bandHeight)
  ) {
    fitZoom -= 1;
    box = measure(fitZoom);
  }

  return {
    zoom: fitZoom,
    anchorY:
      padding.top + bandHeight / 2 + box.middleY - (box.top + box.bottom) / 2,
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
