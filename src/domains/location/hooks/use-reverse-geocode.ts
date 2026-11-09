import { useCallback, useState } from "react";
import { findAddressByCoords } from "@/domains/location/utils/find-address-by-coords";

export function useReverseGeocode() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const getAddressFromCoords = useCallback((lat: number, lng: number) => {
    setLoading(true);

    // 출발지 목록의 둘째 줄이라, 못 찾으면 안내 문구 대신 비워 둔다.
    findAddressByCoords(lat, lng)
      .then((found) => setAddress(found ?? ""))
      .catch(() => setAddress(""))
      .finally(() => setLoading(false));
  }, []);

  return { address, loading, getAddressFromCoords };
}
