import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNaverMap } from "@/domains/location/components/naver-map";

const ANCHOR_TRANSFORM = {
  bottom: "translate(-50%, -100%)",
  center: "translate(-50%, -50%)",
} as const;

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

  useEffect(() => {
    const naverMaps = window.naver?.maps;
    if (!map || !naverMaps?.OverlayView || !naverMaps.LatLng) return;

    const el = document.createElement("div");
    el.style.position = "absolute";
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
