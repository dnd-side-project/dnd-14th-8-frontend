import { Header } from "@moyeorak/design-system";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Empty2Character } from "@/assets/characters";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { ItemSearchResult } from "@/domains/location/components/item-search-result";
import { useCurrentLocation } from "@/domains/location/hooks/use-current-location";
import { usePlaceSearch } from "@/domains/location/hooks/use-place-search";
import {
  isWithinServiceArea,
  OUT_OF_SERVICE_AREA_MESSAGE,
} from "@/domains/location/utils/service-area";
import { SearchIcon, TargetIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { TextField } from "@/shared/components/text-field";
import { toast } from "@/shared/components/toast";

interface VoteSearchLocationState {
  address?: string;
  coords?: [number, number];
  name?: string;
  // 폼이 기억한 진입 위치다. 검색을 다녀오면 폼이 다시 마운트되면서 위치가
  // 달라지므로, 원래 값을 잃지 않게 그대로 실어 보낸다.
  entryIdx?: number | null;
  selectedParticipantId?: string;
}

export function DepartureNewSearchPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state: VoteSearchLocationState | null };
  const [keyword, setKeyword] = useState("");

  const {
    results,
    loading: isSearching,
    failed: searchFailed,
    search,
    cancel: cancelSearch,
  } = usePlaceSearch();

  const {
    address: currentAddress,
    coords: currentCoords,
    loading: isFetchingLocation,
    getCurrentLocation,
  } = useCurrentLocation();

  useEffect(() => {
    if (keyword.trim().length < 2) {
      search("");
      return;
    }

    // 기다리는 동안 앞 검색어의 응답이 도착해도 쓰지 않게 바로 무효로 한다.
    cancelSearch();
    const timer = setTimeout(() => {
      search(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, search, cancelSearch]);

  useEffect(() => {
    if (!currentAddress) return;

    if (currentCoords && !isWithinServiceArea(...currentCoords)) {
      toast.error(OUT_OF_SERVICE_AREA_MESSAGE);
      return;
    }

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
          <Header
            title="주소 검색"
            onBack={() => navigate(-1)}
            className="-mx-5 w-auto"
          />

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
            <p className="textStyle_body4 mt-10 text-center text-fg-neutral-subtler">
              검색 중...
            </p>
          )}

          {!isSearching &&
            results.map((item) => (
              <ItemSearchResult
                key={`${item.x}-${item.y}-${item.title}`}
                text={item.title}
                // 주소 검색 결과는 이름이 없어 주소 한 줄만 보인다.
                description={
                  item.kind === "place"
                    ? item.roadAddress || item.address
                    : undefined
                }
                highlight={keyword}
                onClick={() => {
                  const lat = Number(item.y);
                  const lng = Number(item.x);
                  if (!isWithinServiceArea(lat, lng)) {
                    toast.error(OUT_OF_SERVICE_AREA_MESSAGE);
                    return;
                  }
                  navigate("..", {
                    state: {
                      ...location.state,
                      address: item.roadAddress || item.address,
                      coords: [lat, lng],
                    },
                  });
                }}
              />
            ))}

          {!isSearching &&
            !searchFailed &&
            results.length === 0 &&
            keyword.length > 1 && (
              <div className="mt-25 flex flex-col items-center px-5">
                <PlaceholderContent
                  graphic={<Empty2Character />}
                  title="일치하는 주소가 없어요"
                  description="검색한 지역을 다시 확인해 보세요."
                />
              </div>
            )}
        </div>
      </section>
    </MobileLayout>
  );
}
