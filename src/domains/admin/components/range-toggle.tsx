import { Chip } from "@moyeorak/design-system";
import {
  STATS_RANGES,
  type StatsRange,
} from "@/domains/admin/types/external-api-stats-types";

interface RangeToggleProps {
  value: StatsRange;
  onChange: (range: StatsRange) => void;
}

export function RangeToggle({ value, onChange }: RangeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
      {STATS_RANGES.map((range) => (
        <Chip
          pressed={value === range}
          variant={value === range ? "neutral" : "neutral-weak"}
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className="focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2"
        >
          {range}
        </Chip>
      ))}
    </div>
  );
}
