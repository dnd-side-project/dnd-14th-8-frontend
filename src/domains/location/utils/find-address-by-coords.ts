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

// 좌표로 주소를 찾는다. 장소 검색과 같은 카카오 지도 SDK를 쓴다.
// 도로명 주소가 없는 곳(산, 강 위)은 지번 주소를 돌려주고, 못 찾으면 null이다.
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
    new services.Geocoder().coord2Address(lng, lat, (result, status) => {
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
