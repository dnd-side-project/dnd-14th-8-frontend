import { adminApi } from "@/domains/admin/apis/admin-client";
import type {
  ExternalApiSummaryResponse,
  ExternalApiTrendsResponse,
  StatsRange,
} from "@/domains/admin/types/external-api-stats-types";
import type { ApiResponse } from "@/shared/utils/axios";

export function getExternalApiSummary() {
  return adminApi.get<ApiResponse<ExternalApiSummaryResponse>>(
    "/api/admin/external-api/summary",
  );
}

export function getExternalApiTrends(range: StatsRange) {
  return adminApi.get<ApiResponse<ExternalApiTrendsResponse>>(
    "/api/admin/external-api/trends",
    { params: { range } },
  );
}
