import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { AdminLoginForm } from "@/domains/admin/components/admin-login-form";
import { ApiSummaryCard } from "@/domains/admin/components/api-summary-card";
import { RangeToggle } from "@/domains/admin/components/range-toggle";
import {
  TrendChart,
  type TrendSeries,
} from "@/domains/admin/components/trend-chart";
import { API_COLORS } from "@/domains/admin/constants/api-colors";
import { useAdminAuth } from "@/domains/admin/hooks/use-admin-auth";
import { useExternalApiSummaryQuery } from "@/domains/admin/hooks/use-external-api-summary-query";
import { useExternalApiTrendsQuery } from "@/domains/admin/hooks/use-external-api-trends-query";
import {
  API_LABELS,
  type ApiTrend,
  type StatsRange,
  type TrendPoint,
} from "@/domains/admin/types/external-api-stats-types";

function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function labelFormat(range: StatsRange): string {
  return range === "24h" ? "HH:mm" : "MM/dd";
}

function toLabels(points: TrendPoint[], range: StatsRange): string[] {
  return points.map((point) =>
    format(new Date(point.bucketStart), labelFormat(range)),
  );
}

function toSeries(
  apis: ApiTrend[],
  pick: (point: TrendPoint) => number,
): TrendSeries[] {
  return apis.map((trend) => ({
    label: API_LABELS[trend.api],
    color: API_COLORS[trend.api],
    values: trend.points.map(pick),
  }));
}

interface DashboardProps {
  onUnauthorized: () => void;
  onLogout: () => void;
}

function Dashboard({ onUnauthorized, onLogout }: DashboardProps) {
  const [range, setRange] = useState<StatsRange>("24h");
  const summaryQuery = useExternalApiSummaryQuery();
  const trendsQuery = useExternalApiTrendsQuery(range);

  useEffect(() => {
    if (
      isUnauthorized(summaryQuery.error) ||
      isUnauthorized(trendsQuery.error)
    ) {
      onUnauthorized();
    }
  }, [summaryQuery.error, trendsQuery.error, onUnauthorized]);

  const trends = trendsQuery.data;
  const labels = trends?.apis[0] ? toLabels(trends.apis[0].points, range) : [];
  const googleTrend = trends?.apis.find(
    (entry) => entry.api === "google_routes",
  );

  return (
    <div className="min-h-dvh bg-neutral-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-neutral-900 text-xl">
              외부 API 호출 통계
            </h1>
            {summaryQuery.data ? (
              <p className="mt-0.5 text-neutral-500 text-xs">
                기준{" "}
                {format(new Date(summaryQuery.data.asOf), "yyyy-MM-dd HH:mm")}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <RangeToggle value={range} onChange={setRange} />
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-neutral-600 text-sm hover:text-neutral-900"
            >
              로그아웃
            </button>
          </div>
        </header>

        {summaryQuery.isLoading ? (
          <p className="mt-10 text-center text-neutral-500 text-sm">
            불러오는 중…
          </p>
        ) : null}

        {summaryQuery.data ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryQuery.data.apis.map((summary) => (
              <ApiSummaryCard key={summary.api} summary={summary} />
            ))}
          </div>
        ) : null}

        {trends && labels.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TrendChart
              title="호출수 추이"
              labels={labels}
              series={toSeries(trends.apis, (point) => point.calls)}
            />
            <TrendChart
              title="에러율 추이 (%)"
              labels={labels}
              series={toSeries(trends.apis, (point) => point.errorRate)}
              formatValue={(value) => `${value.toFixed(0)}%`}
            />
            {googleTrend ? (
              <TrendChart
                title="Google 비용 추이 (USD)"
                labels={labels}
                series={[
                  {
                    label: API_LABELS.google_routes,
                    color: API_COLORS.google_routes,
                    values: googleTrend.points.map(
                      (point) => point.costUsd ?? 0,
                    ),
                  },
                ]}
                formatValue={(value) => `$${value.toFixed(2)}`}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (token: string) => {
    setLoginError(null);
    login(token);
  };

  const handleUnauthorized = () => {
    setLoginError("토큰이 올바르지 않습니다. 다시 입력해주세요.");
    logout();
  };

  if (!isAuthenticated) {
    return <AdminLoginForm onSubmit={handleLogin} error={loginError} />;
  }

  return <Dashboard onUnauthorized={handleUnauthorized} onLogout={logout} />;
}
