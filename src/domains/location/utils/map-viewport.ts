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
