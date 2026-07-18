import axios from "axios";

// 백엔드 LocationVoteServiceImpl의 서비스 지역 bounding box와 동일한 값 (E427 검증 기준)
const SERVICE_AREA = {
  minLat: 36.5,
  maxLat: 38.2,
  minLng: 126.2,
  maxLng: 128.0,
};

export const OUT_OF_SERVICE_AREA_MESSAGE =
  "현재는 수도권 내 출발지만 선택할 수 있어요.";

export const OUT_OF_SERVICE_AREA_ERROR_CODE = "E427";

export function isWithinServiceArea(latitude: number, longitude: number) {
  return (
    latitude >= SERVICE_AREA.minLat &&
    latitude <= SERVICE_AREA.maxLat &&
    longitude >= SERVICE_AREA.minLng &&
    longitude <= SERVICE_AREA.maxLng
  );
}

export function isOutOfServiceAreaError(error: unknown) {
  return (
    axios.isAxiosError<{ code?: string }>(error) &&
    error.response?.data?.code === OUT_OF_SERVICE_AREA_ERROR_CODE
  );
}
