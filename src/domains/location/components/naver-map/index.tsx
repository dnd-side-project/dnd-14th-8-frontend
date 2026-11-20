import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CenterPointDto } from "@/domains/location/types/location-api-types";
import { cn } from "@/shared/utils/cn";

const DEFAULT_CENTER: CenterPointDto = {
  latitude: 37.5665,
  longitude: 126.978,
};
const DEFAULT_ZOOM = 13;

export interface NaverMapProps {
  center?: CenterPointDto;
  zoom?: number;
  className?: string;
  children?: ReactNode;
  onMapReady?: (map: naver.maps.Map | null) => void;
  /** 보여 줄 정보가 없을 때 지도를 흐리게 배경으로만 둔다. 조작도 막는다. */
  blurred?: boolean;
}

export function NaverMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className,
  children,
  onMapReady,
  blurred = false,
}: NaverMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const initializedRef = useRef(false);
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    const maps = window.naver?.maps;

    if (!containerRef.current || initializedRef.current || !maps?.Map) return;

    initializedRef.current = true;

    let inst: naver.maps.Map | null = null;

    try {
      inst = new maps.Map(containerRef.current, {
        center: new maps.LatLng(center.latitude, center.longitude),
        zoom,
        zoomControl: false,
        scaleControl: false,
        mapDataControl: false,
        logoControl: true,
        // 하단은 어느 스냅에서든 바텀시트가 덮는다. 약관상 로고는 가려지면
        // 안 되므로 지도가 항상 보이는 좌상단에 둔다(우상단은 주변 장소 버튼).
        logoControlOptions: { position: maps.Position.TOP_LEFT },
        // 기본값(null)이면 두 손가락으로 확대하는 동안 핀 층을 숨겨, 손을 뗄 때까지
        // 핀이 모두 사라진다. MapMarker가 쓰는 overlayLayer만 지도와 함께 움직이게 한다.
        // 데스크톱 Chrome과 Edge에서는 SDK가 이 옵션을 쓰지 않아 지금처럼 숨는다(#265).
        overlayZoomEffect: "overlayLayer",
      });
    } catch {
      initializedRef.current = false;
      return;
    }

    mapRef.current = inst;
    setMap(inst);
    onMapReady?.(inst);

    return () => {
      if (inst) {
        try {
          inst.destroy();
        } catch {
          // ignore destroy errors from unstable map SDK state
        }
      }
      mapRef.current = null;
      setMap(null);
      onMapReady?.(null);
      initializedRef.current = false;
    };
  }, [center.latitude, center.longitude, onMapReady, zoom]);

  useEffect(() => {
    const m = mapRef.current;
    const maps = window.naver?.maps;
    if (!m || !maps?.LatLng) return;

    const cur = m.getCenter() as naver.maps.LatLng;
    if (
      Math.abs(cur.lat() - center.latitude) > 0.0001 ||
      Math.abs(cur.lng() - center.longitude) > 0.0001
    ) {
      m.panTo(new maps.LatLng(center.latitude, center.longitude));
    }
  }, [center.latitude, center.longitude]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    if (m.getZoom() !== zoom) m.setZoom(zoom);
  }, [zoom]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {/*
        isolate가 없으면 SDK가 컨트롤·마커 레이어에 심는 z-index 100대가
        바텀시트(z-20)와 하단 액션바(z-30)를 뚫고 올라온다.

        흐리게 할 때는 지도 위에 막(backdrop-filter)을 얹지 않고 지도 요소에
        직접 filter를 준다. 막을 얹으면 화면 가장자리 글자가 선명하게 남는다.
        filter는 가장자리를 투명하게 번지게 하므로 1.08배 키워 화면 밖으로 민다.
        SDK가 이 요소에 tabindex를 넣으므로, 흐린 동안은 inert로 포커스와
        끌기를 함께 막고 화면 낭독기에서도 뺀다.
      */}
      <div
        ref={containerRef}
        className={cn(
          "isolate h-full w-full transition-[filter,scale] duration-300 ease-out",
          blurred && "scale-[1.08] blur-[8px]",
        )}
        inert={blurred}
      />
      <NaverMapCtx.Provider value={map}>{children}</NaverMapCtx.Provider>
    </div>
  );
}

const NaverMapCtx = createContext<naver.maps.Map | null>(null);

export function useNaverMap() {
  return useContext(NaverMapCtx);
}
