/** 지도 핀을 그리는 모양. label은 이름표, dot은 점이다. */
export type PinShape = "label" | "dot";

/**
 * 지도 핀을 이름표로 그릴지 점으로 그릴지 정한다.
 *
 * 기준은 지도를 맞춘 직후의 확대 단계다. 그보다 축소하면 이름표끼리 덮으므로 점으로
 * 그리고, 기준과 같거나 더 확대하면 이름표로 그린다. 기준이나 지금 확대 단계를 아직
 * 모르면(지도를 맞추기 전) 이름표로 그린다. 화면은 항상 이름표로 열린다.
 */
export function getPinShape({
  zoom,
  fitZoom,
}: {
  zoom: number | null;
  fitZoom: number | null;
}): PinShape {
  if (zoom === null || fitZoom === null) return "label";

  return zoom < fitZoom ? "dot" : "label";
}
