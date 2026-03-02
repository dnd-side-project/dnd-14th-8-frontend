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
}

export function MapDefaultPage() {
  const [mapInst, setMapInst] = useState<naver.maps.Map | null>(null);
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    const maps = window.naver?.maps;
    if (!mapInst || !maps?.Event) return;

    maps.Event.trigger(mapInst, "resize");
  }, [mapInst]);

  return (
    <div className="relative mx-auto h-dvh max-w-[375px] overflow-hidden bg-k-10">
      <NaverMap
        center={DEFAULT_CENTER}
        zoom={11}
        className="absolute inset-0"
        onMapReady={setMapInst}
      >
        <Outlet context={{ mapInst, sheetHeight, setSheetHeight }} />
      </NaverMap>
    </div>
  );
}

export function MapIndexRedirectPage() {
  return <Navigate to="stations" replace />;
}
