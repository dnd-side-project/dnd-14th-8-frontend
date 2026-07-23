import {
  STATS_RANGES,
  type StatsRange,
} from "@/domains/admin/types/external-api-stats-types";
import { cn } from "@/shared/utils/cn";

interface RangeToggleProps {
  value: StatsRange;
  onChange: (range: StatsRange) => void;
}

export function RangeToggle({ value, onChange }: RangeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
      {STATS_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={cn(
            "rounded-md px-3 py-1 font-medium text-sm transition-colors",
            value === range
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:text-neutral-900",
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
