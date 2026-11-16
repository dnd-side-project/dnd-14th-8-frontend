import { Chip, FloatingButton } from "@moyeorak/design-system";
import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";

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

      {/* 스크롤 영역에 포커스 링(두께 2px, 간격 2px)이 들어갈 4px를 둔다. 위, 아래, 왼쪽은 음수 margin으로 되돌려 칩 위치를 그대로 두고, 오른쪽은 되돌리지 않아 평소에 잘리는 위치도 그대로 둔다. */}
      <div className="scrollbar-hide -my-1 -ml-1 flex gap-2 overflow-x-auto p-1">
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
            {r.stationName}
          </Chip>
        ))}
      </div>
    </div>
  );
}
