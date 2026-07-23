export interface TrendSeries {
  label: string;
  color: string;
  values: number[];
}

interface TrendChartProps {
  title: string;
  labels: string[];
  series: TrendSeries[];
  formatValue?: (value: number) => string;
}

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = { top: 16, right: 16, bottom: 28, left: 44 };

const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

function xAt(index: number, count: number) {
  if (count <= 1) return PADDING.left;
  return PADDING.left + (PLOT_WIDTH * index) / (count - 1);
}

function yAt(value: number, max: number) {
  if (max <= 0) return PADDING.top + PLOT_HEIGHT;
  return PADDING.top + PLOT_HEIGHT - (PLOT_HEIGHT * value) / max;
}

export function TrendChart({
  title,
  labels,
  series,
  formatValue = (value) => value.toLocaleString("ko-KR"),
}: TrendChartProps) {
  const count = labels.length;
  const max = Math.max(1, ...series.flatMap((entry) => entry.values));

  const xTickIndices =
    count <= 1 ? [0] : [0, Math.floor((count - 1) / 2), count - 1];

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900 text-sm">{title}</h3>
        <ul className="flex flex-wrap gap-3">
          {series.map((entry) => (
            <li
              key={entry.label}
              className="flex items-center gap-1.5 text-neutral-600 text-xs"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[480px]"
          role="img"
          aria-label={title}
        >
          <line
            x1={PADDING.left}
            y1={PADDING.top + PLOT_HEIGHT}
            x2={PADDING.left + PLOT_WIDTH}
            y2={PADDING.top + PLOT_HEIGHT}
            stroke="#e5e5e5"
          />
          <text
            x={PADDING.left - 8}
            y={PADDING.top + 4}
            textAnchor="end"
            className="fill-neutral-400 text-[10px]"
          >
            {formatValue(max)}
          </text>
          <text
            x={PADDING.left - 8}
            y={PADDING.top + PLOT_HEIGHT}
            textAnchor="end"
            className="fill-neutral-400 text-[10px]"
          >
            0
          </text>

          {xTickIndices.map((index) => (
            <text
              key={index}
              x={xAt(index, count)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-neutral-400 text-[10px]"
            >
              {labels[index]}
            </text>
          ))}

          {series.map((entry) => (
            <polyline
              key={entry.label}
              fill="none"
              stroke={entry.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={entry.values
                .map(
                  (value, index) => `${xAt(index, count)},${yAt(value, max)}`,
                )
                .join(" ")}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
