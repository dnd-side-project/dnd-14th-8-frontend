import { useCallback, useState } from "react";
import { findAddressByCoords } from "@/domains/location/utils/find-address-by-coords";
import { toast } from "@/shared/components/toast";

type Coordinates = [number, number];

const CURRENT_LOCATION_FAILED_MESSAGE =
  "현 위치를 불러오지 못했어요. 다시 시도해주세요";

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback((coords: Coordinates) => {
    const [lat, lng] = coords;

    findAddressByCoords(lat, lng)
      .then((found) => {
        if (found) {
          setAddress(found);
        } else {
          setError(CURRENT_LOCATION_FAILED_MESSAGE);
        }
      })
      .catch(() => setError(CURRENT_LOCATION_FAILED_MESSAGE))
      .finally(() => setLoading(false));
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
      (error: GeolocationPositionError) => {
        // 권한을 거부했을 때만 설정 안내를 하고, 시간 초과처럼 다시 시도하면 될 수 있는 오류는 따로 알린다.
        toast.error(
          error.code === error.PERMISSION_DENIED
            ? "설정에서 위치 권한을 허용해주세요"
            : "현재 위치를 찾지 못했어요. 다시 시도해주세요",
        );
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
