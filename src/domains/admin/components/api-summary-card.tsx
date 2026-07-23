import {
  API_LABELS,
  type ApiSummary,
} from "@/domains/admin/types/external-api-stats-types";
import { cn } from "@/shared/utils/cn";

interface ApiSummaryCardProps {
  summary: ApiSummary;
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

export function ApiSummaryCard({ summary }: ApiSummaryCardProps) {
  const hasQuota =
    summary.dailyQuota !== null && summary.quotaRemaining !== null;
  const quotaUsedRatio =
    hasQuota && summary.dailyQuota ? summary.calls / summary.dailyQuota : 0;
  const quotaWarning = hasQuota && quotaUsedRatio >= 0.8;

  const successColor =
    summary.successRate >= 99
      ? "text-green-600"
      : summary.successRate >= 95
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 text-sm">
          {API_LABELS[summary.api]}
        </h3>
        {summary.rateLimited > 0 ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-600 text-xs">
            429 · {formatNumber(summary.rateLimited)}
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
        <div>
          <dt className="text-neutral-500">오늘 호출</dt>
          <dd className="font-semibold text-neutral-900">
            {formatNumber(summary.calls)}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500">성공률</dt>
          <dd className={cn("font-semibold", successColor)}>
            {summary.successRate.toFixed(1)}%
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500">p95</dt>
          <dd className="font-semibold text-neutral-900">
            {Math.round(summary.p95Ms)}ms
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500">실패</dt>
          <dd className="font-semibold text-neutral-900">
            {formatNumber(summary.failure)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-neutral-100 border-t pt-3 text-sm">
        {hasQuota ? (
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">한도 잔여</span>
            <span
              className={cn(
                "font-medium",
                quotaWarning ? "text-red-600" : "text-neutral-900",
              )}
            >
              {formatNumber(summary.quotaRemaining ?? 0)} /{" "}
              {formatNumber(summary.dailyQuota ?? 0)}
            </span>
          </div>
        ) : null}
        {summary.todayCostUsd !== null ? (
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">오늘 비용</span>
            <span className="font-medium text-neutral-900">
              ${summary.todayCostUsd.toFixed(3)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
