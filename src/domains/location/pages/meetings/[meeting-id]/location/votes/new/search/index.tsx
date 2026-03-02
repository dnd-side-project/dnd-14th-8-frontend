import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Empty2Character } from "@/assets/characters";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { ItemSearchResult } from "@/domains/location/components/item-search-result";
import { useCurrentLocation } from "@/domains/location/hooks/use-current-location";
import { usePlaceSearch } from "@/domains/location/hooks/use-place-search";
import { SearchIcon, TargetIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { TextField } from "@/shared/components/text-field";

interface VoteSearchLocationState {
  address?: string;
  coords?: [number, number];
  name?: string;
  selectedParticipantId?: string;
}

const FALLBACK_COORDS: [number, number] = [37.5665, 126.978];

export function DepartureNewSearchPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state: VoteSearchLocationState | null };
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

  useEffect(() => {
    if (keyword.trim().length < 2) {
      search("");
      return;
    }

    const timer = setTimeout(() => {
      search(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, search]);

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

        <div className="mt-4 flex-1 overflow-y-auto">
          {isSearching && (
            <p className="mt-10 text-center text-b4 text-k-400">검색 중...</p>
          )}

          {!isSearching &&
            results.map((item) => (
              <ItemSearchResult
                key={`${item.x}-${item.y}`}
                text={item.title}
                description={item.roadAddress || item.address}
                highlight={keyword}
                onClick={() =>
                  navigate("..", {
                    state: {
                      ...location.state,
                      address: item.roadAddress || item.address,
                      coords: [Number(item.y), Number(item.x)],
                    },
                  })
                }
              />
            ))}

          {!isSearching && results.length === 0 && keyword.length > 1 && (
            <div className="mt-25 flex flex-col items-center gap-4 px-5">
              <PlaceholderContent
                graphic={<Empty2Character />}
                title="일치하는 주소가 없어요.."
                description="검색한 지역을 다시 확인해 보세요."
              />

              <ButtonSubStroke
                onClick={() =>
                  navigate("..", {
                    state: {
                      ...location.state,
                      address: keyword.trim(),
                      coords: FALLBACK_COORDS,
                    },
                  })
                }
              >
                입력한 주소로 직접 등록하기
              </ButtonSubStroke>
            </div>
          )}
        </div>

        {(searchError || locationError) && (
          <p className="mt-2 px-5 text-b4 text-red-500">
            {searchError || locationError}
          </p>
        )}
      </section>
    </MobileLayout>
  );
}
