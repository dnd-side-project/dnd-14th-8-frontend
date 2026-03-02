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
}

export function NaverMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className,
  children,
  onMapReady,
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
        logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
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
      <div ref={containerRef} className="h-full w-full" />
      <NaverMapCtx.Provider value={map}>{children}</NaverMapCtx.Provider>
    </div>
  );
}

const NaverMapCtx = createContext<naver.maps.Map | null>(null);

export function useNaverMap() {
  return useContext(NaverMapCtx);
}
