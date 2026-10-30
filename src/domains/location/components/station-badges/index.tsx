import { Chip } from "@moyeorak/design-system";
import { FloatingBack } from "@/domains/location/components/floating-back";
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
      <FloatingBack onClick={onBack} className="shrink-0" />

      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
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
