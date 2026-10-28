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
      setError("지도를 아직 불러오는 중이에요. 잠시 후 다시 시도해주세요.");
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
          "주소를 찾을 수 없어요";

        setAddress(resolvedAddress);
        setLoading(false);
      },
    );
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치를 가져올 수 없어요.");
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
