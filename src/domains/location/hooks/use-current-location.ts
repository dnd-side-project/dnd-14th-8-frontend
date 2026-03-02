import { useCallback, useState } from "react";
import { toast } from "@/shared/components/toast";

type Coordinates = [number, number];

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback((coords: Coordinates) => {
    const naverMaps = window.naver?.maps;
    const service = naverMaps?.Service;
    const LatLng = naverMaps?.LatLng;

    if (!service || !LatLng) {
      setError("지도 SDK가 아직 로드되지 않았습니다.");
      setLoading(false);
      return;
    }

    const [lat, lng] = coords;

    service.reverseGeocode(
      {
        coords: new LatLng(lat, lng),
        orders: [service.OrderType.ADDR, service.OrderType.ROAD_ADDR].join(","),
      },
      (
        status: naver.maps.Service.Status,
        response: naver.maps.Service.ReverseGeocodeResponse,
      ) => {
        if (status !== service.Status.OK) {
          setError("주소를 찾을 수 없어요");
          setLoading(false);
          return;
        }

        const resolvedAddress =
          response.v2.address?.roadAddress ||
          response.v2.address?.jibunAddress ||
          "주소를 찾을 수 없습니다.";

        setAddress(resolvedAddress);
        setLoading(false);
      },
    );
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const currentCoords: Coordinates = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setCoords(currentCoords);
        reverseGeocode(currentCoords);
      },
      () => {
        toast.error("위치 권한이 필요해요");
        setLoading(false);
      },
    );
  }, [reverseGeocode]);

  return {
    coords,
    address,
    loading,
    error,
    getCurrentLocation,
  };
}
