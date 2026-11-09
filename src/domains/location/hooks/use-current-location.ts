import { useCallback, useState } from "react";
import { findAddressByCoords } from "@/domains/location/utils/find-address-by-coords";
import { getLocationPermissionDeniedMessage } from "@/domains/location/utils/location-permission-message";
import { toast } from "@/shared/components/toast";

type Coordinates = [number, number];

const CURRENT_LOCATION_FAILED_MESSAGE =
  "현 위치를 불러오지 못했어요. 다시 시도해주세요";

const showFailure = () => toast.error(CURRENT_LOCATION_FAILED_MESSAGE);

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const reverseGeocode = useCallback((coords: Coordinates) => {
    const [lat, lng] = coords;

    findAddressByCoords(lat, lng)
      .then((found) => {
        if (found) {
          setAddress(found);
        } else {
          showFailure();
        }
      })
      .catch(showFailure)
      .finally(() => setLoading(false));
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("이 브라우저에서는 현 위치를 불러올 수 없어요");
      return;
    }

    setLoading(true);

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
        // 권한을 거부했을 때만 다시 허용하는 방법을 안내하고, 시간 초과처럼 다시 시도하면 될 수 있는 오류는 따로 알린다.
        toast.error(
          error.code === error.PERMISSION_DENIED
            ? getLocationPermissionDeniedMessage(navigator.userAgent)
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
    getCurrentLocation,
  };
}
