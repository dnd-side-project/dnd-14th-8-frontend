import {
  getMapFitPadding,
  getVisibleCenterOffsetY,
  isAnchoredBoxHidden,
} from "@/domains/location/utils/map-viewport";

/**
 * 바텀시트가 지도 아래를 덮고 있으므로, 좌표를 컨테이너 정중앙이 아니라
 * 시트가 비워둔 영역의 한가운데로 보낸다. 그냥 panTo 하면 fitBounds에
 * 준 하단 패딩이 무시되고 대상이 시트 뒤로 숨는다.
 *
 * animate가 false면 움직이지 않고 바로 옮긴다. panTo는 움직이는 동안 getCenter가 출발점을 돌려줘서,
 * 바로 뒤에 지도 위 자리를 계산해야 할 때(장소를 고른 채 링크로 열 때, #271) 쓴다.
 */
export function panToVisibleCenter({
  latitude,
  longitude,
  mapInst,
  sheetHeight,
  animate = true,
}: {
  latitude: number;
  longitude: number;
  mapInst: naver.maps.Map;
  sheetHeight: number;
  animate?: boolean;
}) {
  const maps = window.naver?.maps;
  if (!maps) return;

  const target = new maps.LatLng(latitude, longitude);
  const projection = mapInst.getProjection();
  const offset = projection.fromCoordToOffset(target);
  const center = projection.fromOffsetToCoord(
    new maps.Point(
      offset.x,
      getVisibleCenterOffsetY({
        mapHeight: mapInst.getSize().height,
        sheetHeight,
        targetOffsetY: offset.y,
      }),
    ),
  );

  if (animate) {
    mapInst.panTo(center);
  } else {
    mapInst.setCenter(center);
  }
}

/**
 * 좌표에 아래 가운데를 맞춘 핀(이름표 포함)이 시트 뒤나 화면 밖에 걸리면 그 좌표를 시트가 비워 둔 영역의
 * 가운데로 옮긴다(#271). 다 보이면 지도를 그대로 두고 false를 돌려준다.
 * 시트가 지도를 거의 다 덮었으면(full 스냅) 옮겨도 다 보이지 않으니 그대로 둔다(getMapFitPadding과 같은 기준).
 */
export function revealAnchoredBox({
  latitude,
  longitude,
  boxWidth,
  boxHeight,
  mapInst,
  sheetHeight,
}: {
  latitude: number;
  longitude: number;
  boxWidth: number;
  boxHeight: number;
  mapInst: naver.maps.Map;
  sheetHeight: number;
}): boolean {
  const maps = window.naver?.maps;
  if (!maps) return false;

  const size = mapInst.getSize();
  if (!getMapFitPadding({ mapHeight: size.height, sheetHeight })) return false;

  // 지도 중심은 컨테이너 한가운데에 그려진다. 중심과 좌표의 픽셀 차이로 컨테이너 안 자리를 구한다.
  const projection = mapInst.getProjection();
  const center = projection.fromCoordToOffset(mapInst.getCenter());
  const target = projection.fromCoordToOffset(
    new maps.LatLng(latitude, longitude),
  );

  const hidden = isAnchoredBoxHidden({
    anchorX: size.width / 2 + (target.x - center.x),
    anchorY: size.height / 2 + (target.y - center.y),
    boxWidth,
    boxHeight,
    mapWidth: size.width,
    mapHeight: size.height,
    sheetHeight,
  });
  if (!hidden) return false;

  panToVisibleCenter({ latitude, longitude, mapInst, sheetHeight });
  return true;
}
