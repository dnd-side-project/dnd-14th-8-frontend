interface KakaoGeocoderResult {
  road_address: { address_name: string } | null;
  address: { address_name: string } | null;
}

interface KakaoServices {
  Geocoder: new () => {
    coord2Address: (
      lng: number,
      lat: number,
      callback: (result: KakaoGeocoderResult[], status: string) => void,
    ) => void;
  };
  Status: { OK: string };
}

function getKakaoServices() {
  return (window.kakao as { maps?: { services?: KakaoServices } } | undefined)
    ?.maps?.services;
}

// 카카오 SDK는 응답이 오지 않으면 콜백을 부르지 않는다(요청이 끊기면 바로 부른다).
// 그대로 두면 현 위치 버튼이 "불러오는 중"에서 풀리지 않아, 이 시간이 지나면 못 찾은 것으로 본다.
export const FIND_ADDRESS_TIMEOUT_MS = 10_000;

// 좌표로 주소를 찾는다. 장소 검색과 같은 카카오 지도 SDK를 쓴다.
// 도로명 주소가 없는 곳(산, 강 위)은 지번 주소를 돌려주고, 못 찾거나 시간이 지나면 null이다.
// SDK가 없으면 reject한다.
export function findAddressByCoords(
  lat: number,
  lng: number,
): Promise<string | null> {
  const services = getKakaoServices();

  if (!services) {
    return Promise.reject(new Error("KAKAO_SERVICES_UNAVAILABLE"));
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), FIND_ADDRESS_TIMEOUT_MS);

    new services.Geocoder().coord2Address(lng, lat, (result, status) => {
      clearTimeout(timer);

      if (status !== services.Status.OK) {
        resolve(null);
        return;
      }

      const [first] = result;
      resolve(
        first?.road_address?.address_name ||
          first?.address?.address_name ||
          null,
      );
    });
  });
}
