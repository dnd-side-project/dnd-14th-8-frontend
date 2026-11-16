import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { NaverMap } from "@/domains/location/components/naver-map";
import type { CenterPointDto } from "@/domains/location/types/location-api-types";

const DEFAULT_CENTER: CenterPointDto = {
  latitude: 37.5665,
  longitude: 126.978,
};

export interface MapPageOutletContext {
  mapInst: naver.maps.Map | null;
  sheetHeight: number;
  setSheetHeight: (height: number) => void;
  /** 하위 화면이 지도를 흐리게 할지 정한다. 화면을 떠날 때 false로 되돌린다. */
  setMapBlurred: (blurred: boolean) => void;
}

export function MapDefaultPage() {
  const [mapInst, setMapInst] = useState<naver.maps.Map | null>(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isMapBlurred, setMapBlurred] = useState(false);

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !maps?.Event) return;

    maps.Event.trigger(mapInst, "resize");
  }, [mapInst]);

  return (
    <div className="relative mx-auto h-dvh max-w-[375px] overflow-hidden bg-fill-neutral-subtlest">
      <NaverMap
        center={DEFAULT_CENTER}
        zoom={11}
        className="absolute inset-0"
        onMapReady={setMapInst}
        blurred={isMapBlurred}
      >
        <Outlet
          context={{ mapInst, sheetHeight, setSheetHeight, setMapBlurred }}
        />
      </NaverMap>
    </div>
  );
}

export function MapIndexRedirectPage() {
  return <Navigate to="stations" replace />;
}
