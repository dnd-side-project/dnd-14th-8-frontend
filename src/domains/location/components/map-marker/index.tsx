import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNaverMap } from "@/domains/location/components/naver-map";

const ANCHOR_TRANSFORM = {
  bottom: "translate(-50%, -100%)",
  center: "translate(-50%, -50%)",
} as const;

/** 확대 효과 중 SDK가 부르는 scale을 가진 OverlayView. 타입 정의에는 없다. */
type ZoomEffectOverlay = naver.maps.OverlayView & {
  scale?: (ratio: number) => void;
};

export interface MapMarkerProps {
  latitude: number;
  longitude: number;
  children: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
  /**
   * false면 눌림을 받지 않고 아래에 있는 핀이나 지도로 넘긴다.
   * 보이는 것보다 상자가 큰 핀이 아래 핀을 막지 않게 할 때 쓴다.
   */
  interactive?: boolean;
  /**
   * 좌표에 맞출 자리. bottom은 아래 가운데라 꼬리가 있는 이름표와 핀에 쓰고,
   * center는 한가운데라 꼬리가 없는 점에 쓴다.
   */
  anchor?: keyof typeof ANCHOR_TRANSFORM;
}

/** OverlayView 기반 React 마커 */
export function MapMarker({
  latitude,
  longitude,
  children,
  onClick,
  zIndex = 100,
  interactive = true,
  anchor = "bottom",
}: MapMarkerProps) {
  const map = useNaverMap();
  const elRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<naver.maps.OverlayView | null>(null);
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  // 화면을 그리기 전에 지도에 올린다. 그린 뒤에 올리면 핀이 통째로 바뀔 때(주변 살펴보기 분류 바꾸기) 예전 핀은
  // 없고 새 핀은 아직 없는 프레임이 하나 생긴다(#275).
  useLayoutEffect(() => {
    const naverMaps = window.naver?.maps;
    if (!map || !naverMaps?.OverlayView || !naverMaps.LatLng) return;

    const el = document.createElement("div");
    el.style.position = "absolute";
    // 아래 scale()이 거는 비율이 좌표 자리(상자 왼쪽 위)를 기준으로 걸리게 한다.
    el.style.transformOrigin = "0 0";
    el.style.zIndex = String(zIndex);
    el.style.cursor = onClick ? "pointer" : "default";
    if (!interactive) el.style.pointerEvents = "none";
    elRef.current = el;

    if (onClick) el.addEventListener("click", onClick);

    let ov: naver.maps.OverlayView;

    try {
      ov = new naverMaps.OverlayView();
    } catch {
      if (onClick) el.removeEventListener("click", onClick);
      return;
    }

    ov.onAdd = function () {
      try {
        const panes = (this as naver.maps.OverlayView).getPanes();
        panes.overlayLayer.appendChild(el);
        setPortal(el);
      } catch {
        setPortal(null);
      }
    };

    ov.draw = function () {
      try {
        const proj = (this as naver.maps.OverlayView).getProjection();
        const pt = proj.fromCoordToOffset(
          new naverMaps.LatLng(latitude, longitude),
        );
        el.style.left = `${pt.x}px`;
        el.style.top = `${pt.y}px`;
        el.style.transform = ANCHOR_TRANSFORM[anchor];
      } catch {
        // ignore draw errors from unstable map SDK state
      }
    };

    // 두 손가락으로 확대하는 동안 SDK는 핀 층을 지도와 같은 비율(ratio)로 키우거나
    // 줄이고, 오버레이마다 scale(ratio)를 부른다(지도 옵션 overlayZoomEffect, NaverMap).
    // 반대 비율을 걸어 핀 크기는 그대로 두고 자리만 지도를 따라가게 한다. 확대가
    // 끝나면 SDK가 draw()를 다시 불러 transform이 원래대로 돌아온다. 네이버 Marker가
    // 쓰는 방식인데 공개 문서에는 없는 SDK 동작이라, 없어지면 확대하는 동안 핀이
    // 지도와 함께 커지고 작아진다.
    (ov as ZoomEffectOverlay).scale = (ratio) => {
      el.style.transform = `scale(${1 / ratio}) ${ANCHOR_TRANSFORM[anchor]}`;
    };

    ov.onRemove = () => {
      if (el.parentNode) el.parentNode.removeChild(el);
      setPortal(null);
    };

    try {
      ov.setMap(map);
      overlayRef.current = ov;
    } catch {
      if (onClick) el.removeEventListener("click", onClick);
      return;
    }

    return () => {
      if (onClick) el.removeEventListener("click", onClick);
      try {
        ov.setMap(null);
      } catch {
        // ignore cleanup errors from unstable map SDK state
      }
      overlayRef.current = null;
      elRef.current = null;
      setPortal(null);
    };
  }, [map, latitude, longitude, onClick, zIndex, interactive, anchor]);

  if (!portal) return null;
  return createPortal(children, portal);
}
