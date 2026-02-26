import { useCallback, useState } from "react";

export function useReverseGeocode() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getAddressFromCoords = useCallback((lat: number, lng: number) => {
    if (!window.naver || !window.naver.maps.Service) {
      return;
    }

    setLoading(true);

    window.naver.maps.Service.reverseGeocode(
      {
        coords: new window.naver.maps.LatLng(lat, lng),
        orders: [
          window.naver.maps.Service.OrderType.ADDR,
          window.naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
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
