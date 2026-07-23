import { useQuery } from "@tanstack/react-query";
import { getExternalApiSummary } from "@/domains/admin/apis/external-api-stats-api";

export function externalApiSummaryQueryKey() {
  return ["admin", "external-api", "summary"];
}

export function useExternalApiSummaryQuery(enabled = true) {
  return useQuery({
    enabled,
    queryKey: externalApiSummaryQueryKey(),
    queryFn: () => getExternalApiSummary().then(({ data }) => data.data),
    refetchInterval: 60_000,
  });
}
