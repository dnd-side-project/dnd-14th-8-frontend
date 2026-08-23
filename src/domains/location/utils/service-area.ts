import axios from "axios";

// 백엔드 LocationVoteServiceImpl의 서비스 지역 bounding box와 동일한 값 (E427 검증 기준)
const SERVICE_AREA = {
  minLat: 36.5,
  maxLat: 38.2,
  minLng: 126.2,
  maxLng: 128.0,
};

export const OUT_OF_SERVICE_AREA_MESSAGE =
  "아직 서비스하지 않는 지역이에요. 다른 출발지를 선택해주세요.";

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
