import {
  getMapFitPadding,
  getRevealAnchorY,
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
 * anchorY를 넘기면 가운데 대신 컨테이너 위에서 그 자리(px)에 좌표를 둔다(getRevealAnchorY).
 */
export function panToVisibleCenter({
  latitude,
  longitude,
  mapInst,
  sheetHeight,
  animate = true,
  anchorY,
}: {
  latitude: number;
  longitude: number;
  mapInst: naver.maps.Map;
  sheetHeight: number;
  animate?: boolean;
  anchorY?: number;
}) {
  const maps = window.naver?.maps;
  if (!maps) return;

  const target = new maps.LatLng(latitude, longitude);
  const projection = mapInst.getProjection();
  const offset = projection.fromCoordToOffset(target);
  const mapHeight = mapInst.getSize().height;
  // 지도 중심은 컨테이너 한가운데에 그려진다. 좌표를 anchorY에 두려면 중심을 좌표보다 (한가운데 - anchorY)만큼 아래로 잡는다.
  const centerOffsetY =
    anchorY === undefined
      ? getVisibleCenterOffsetY({
          mapHeight,
          sheetHeight,
          targetOffsetY: offset.y,
        })
      : offset.y + (mapHeight / 2 - anchorY);
  const center = projection.fromOffsetToCoord(
    new maps.Point(offset.x, centerOffsetY),
  );

  if (animate) {
    mapInst.panTo(center);
  } else {
    mapInst.setCenter(center);
  }
}

/**
 * 좌표에 아래 가운데를 맞춘 핀(이름표 포함)이 시트 뒤나 화면 밖에 걸리면 그 좌표를 시트가 비워 둔 영역의
 * 가운데로 옮긴다(#271). 영역이 좁아 가운데에서 위쪽이 잘리면 다 들어가는 자리까지 내린다(getRevealAnchorY).
 * 다 보이면 지도를 그대로 두고 false를 돌려준다.
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

  // 남은 영역이 좁으면 가운데 대신 상자가 다 들어가는 자리까지 내린다(CodeRabbit 지적, PR #272).
  panToVisibleCenter({
    latitude,
    longitude,
    mapInst,
    sheetHeight,
    anchorY: getRevealAnchorY({
      mapHeight: size.height,
      sheetHeight,
      boxHeight,
    }),
  });
  return true;
}
