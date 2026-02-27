import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Empty2Character } from "@/assets/characters";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { ItemSearchResult } from "@/domains/location/components/item-search-result"; // 추가
import { useCurrentLocation } from "@/domains/location/hooks/use-current-location";
import { usePlaceSearch } from "@/domains/location/hooks/use-place-search";
import { SearchIcon, TargetIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { TextField } from "@/shared/components/text-field";

export function DepartureNewSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");

  const {
    results,
    loading: isSearching,
    error: searchError,
    search,
  } = usePlaceSearch();

  const {
    address: currentAddress,
    coords: currentCoords,
    loading: isFetchingLocation,
    error: locationError,
    getCurrentLocation,
  } = useCurrentLocation();

  // 🔎 디바운스 검색
  useEffect(() => {
    if (keyword.trim().length < 2) {
      // 만약 usePlaceSearch에서 clearResults 같은 함수를 제공한다면 호출
      // 현재는 search 함수 내부에 빈 값 처리가 있으므로 바로 호출 가능합니다.
      search("");
      return;
    }

    const timer = setTimeout(() => {
      search(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, search]);

  // 📍 현 위치 성공 시 자동 이동
  useEffect(() => {
    if (!currentAddress) return;

    navigate("..", {
      state: {
        ...location.state,
        address: currentAddress,
        coords: currentCoords,
      },
    });
  }, [currentAddress, currentCoords, navigate, location.state]);

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col pb-5">
        <div className="px-5">
          <PageHeader title="장소 찾기" onBack={() => navigate(-1)} />

          <TextField
            autoFocus
            placeholder="지하철역, 아파트 이름 등으로 검색"
            leftIcon={SearchIcon}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-3 mb-3"
          />

          <ButtonSubStroke
            icon={<TargetIcon />}
            onClick={getCurrentLocation}
            disabled={isFetchingLocation}
          >
            {isFetchingLocation ? "불러오는 중..." : "현 위치 불러오기"}
          </ButtonSubStroke>
        </div>

        {/* 🔍 검색 결과 리스트 */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {isSearching && (
            <p className="mt-10 text-center text-gray-400 text-sm">
              검색 중...
            </p>
          )}

          {!isSearching &&
            results.map((item) => (
              <ItemSearchResult
                key={`${item.x}-${item.y}`}
                // 1. 장소 이름을 메인 텍스트로 표시
                text={item.title}
                // 2. 주소 정보를 설명으로 표시
                description={item.roadAddress || item.address}
                highlight={keyword}
                onClick={() =>
                  navigate("..", {
                    state: {
                      ...location.state,
                      address: item.title, // 선택한 장소명 전달
                      coords: [Number(item.y), Number(item.x)],
                    },
                  })
                }
              />
            ))}

          {!isSearching && results.length === 0 && keyword.length > 1 && (
            <div className="mt-25 flex flex-col items-center">
              <PlaceholderContent
                graphic={<Empty2Character />}
                title="일치하는 주소가 없어요.."
                description="검색한 지역을 다시 확인해 보세요."
              />
            </div>
          )}
        </div>

        {(searchError || locationError) && (
          <p className="mt-2 px-5 text-red-500 text-sm">
            {searchError || locationError}
          </p>
        )}
      </section>
    </MobileLayout>
  );
}
