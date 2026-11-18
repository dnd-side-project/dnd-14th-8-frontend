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
    // 공통 틀(MobileLayout), 하단 버튼 영역(FixedBottomArea)과 같은 규칙으로,
    // 휴대폰에서는 화면 전체 폭을 쓰고 640px 이상에서만 가운데 375px로 줄인다.
    <div className="relative mx-auto h-dvh overflow-hidden bg-fill-neutral-subtlest sm:max-w-[375px]">
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
