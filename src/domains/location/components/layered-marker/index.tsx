import { MapMarker } from "@/domains/location/components/map-marker";
import { Marker, type MarkerProps } from "@/domains/location/components/marker";

/**
 * 아이콘을 쌓는 순서. 지도 위 이름표(화면마다 90부터 130까지)보다 항상 아래다.
 * 아이콘에는 글자가 없어서, 다른 핀과 겹치면 그 핀의 이름표가 위로 온다.
 */
export const MARKER_ICON_Z_INDEX = 80;

export interface LayeredMarkerProps extends Omit<MarkerProps, "part"> {
  latitude: number;
  longitude: number;
  /** 이름표를 쌓는 순서 */
  zIndex: number;
}

/**
 * 지도에 올리는 Marker. 이름표와 아이콘을 같은 좌표에 따로 올려 쌓는 순서를 나눈다.
 * 이름표 층은 아이콘 자리만큼 빈 상자가 있어서, 그 자리에 낀 다른 핀을 막지 않도록 눌림을 받지 않는다.
 */
export function LayeredMarker({
  latitude,
  longitude,
  zIndex,
  ...markerProps
}: LayeredMarkerProps) {
  return (
    <>
      <MapMarker
        latitude={latitude}
        longitude={longitude}
        zIndex={MARKER_ICON_Z_INDEX}
        interactive={false}
      >
        <Marker {...markerProps} part="icon" />
      </MapMarker>
      <MapMarker
        latitude={latitude}
        longitude={longitude}
        zIndex={zIndex}
        interactive={false}
      >
        <Marker {...markerProps} part="label" />
      </MapMarker>
    </>
  );
}
