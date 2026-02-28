import { useCallback, useState } from "react";

export function useReverseGeocode() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const getAddressFromCoords = useCallback((lat: number, lng: number) => {
    const naverMaps = window.naver?.maps;
    const service = naverMaps?.Service;
    const LatLng = naverMaps?.LatLng;

    if (!service || !LatLng) {
      setAddress("");
      return;
    }

    setLoading(true);

    service.reverseGeocode(
      {
        coords: new LatLng(lat, lng),
        orders: [service.OrderType.ADDR, service.OrderType.ROAD_ADDR].join(","),
      },
      (status, response) => {
        if (status !== service.Status.OK) {
          setAddress("주소를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const result = response.v2.address;
        const formattedAddress =
          result.roadAddress ||
          result.jibunAddress ||
          "주소를 찾을 수 없습니다.";

        setAddress(formattedAddress);
        setLoading(false);
      },
    );
  }, []);

  return { address, loading, getAddressFromCoords };
}
