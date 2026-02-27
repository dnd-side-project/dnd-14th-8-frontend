import { FloatingBack } from "@/domains/location/components/floating-back";
import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";
import { ChipButton } from "@/shared/components/chip-button";

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
          <ChipButton
            key={r.stationId}
            size="md"
            variant={
              r.stationId === selectedStationId
                ? "floatingSelected"
                : "floating"
            }
            onClick={() => onStationClick?.(r)}
          >
            {r.stationName}
          </ChipButton>
        ))}
      </div>
    </div>
  );
}
