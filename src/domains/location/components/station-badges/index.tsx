import { Chip, FloatingButton } from "@moyeorak/design-system";
import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";
import { formatStationName } from "@/domains/location/utils/format";
import { attachRevealFocusedChip } from "@/shared/utils/reveal-in-scroller";

export interface StationBadgesProps {
  recommendations: StationRecommendationDto[];
  selectedStationId?: number;
  onBack: () => void;
  onStationClick?: (station: StationRecommendationDto) => void;
}

/** 지도 상단의 뒤로가기 + 역 칩 */
export function StationBadges({
  recommendations,
  selectedStationId,
  onBack,
  onStationClick,
}: StationBadgesProps) {
  return (
    <div className="absolute top-[52px] right-0 left-0 z-30 flex items-center gap-2 px-5">
      <FloatingButton
        type="back"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="shrink-0"
      />

      {/* SEED 안전 영역 패턴(스크롤되는 콘텐츠)처럼 칩 줄의 오른쪽을 화면 끝까지 잇는다. 왼쪽은 뒤로 가기 버튼 옆에서 시작한다. 왼쪽과 위아래는 포커스 링(두께 2px, 간격 2px)이 들어갈 4px를 두고 margin으로 되돌리고, 오른쪽 20px는 링 자리도 맡는다. */}
      <div
        className="scrollbar-hide -my-1 -mr-5 -ml-1 flex gap-2 overflow-x-auto py-1 pr-5 pl-1"
        ref={attachRevealFocusedChip}
      >
        {recommendations.map((r) => (
          <Chip
            key={r.stationId}
            shape="pill"
            pressed={r.stationId === selectedStationId}
            variant={
              r.stationId === selectedStationId ? "neutral" : "neutral-weak"
            }
            className="shrink-0 shadow-[var(--shadows-strong)]"
            onClick={() => onStationClick?.(r)}
          >
            {formatStationName(r.stationName)}
          </Chip>
        ))}
      </div>
    </div>
  );
}
