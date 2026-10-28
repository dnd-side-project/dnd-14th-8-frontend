import { useQuery } from "@tanstack/react-query";
import { getExternalApiTrends } from "@/domains/admin/apis/external-api-stats-api";
import type { StatsRange } from "@/domains/admin/types/external-api-stats-types";

export function externalApiTrendsQueryKey(range: StatsRange) {
  return ["admin", "external-api", "trends", range];
}

export function useExternalApiTrendsQuery(range: StatsRange, enabled = true) {
  return useQuery({
    enabled,
    queryKey: externalApiTrendsQueryKey(range),
    queryFn: () => getExternalApiTrends(range).then(({ data }) => data.data),
  });
}
