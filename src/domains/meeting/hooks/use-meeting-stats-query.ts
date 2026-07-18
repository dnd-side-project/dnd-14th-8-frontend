import { useQuery } from "@tanstack/react-query";
import { getMeetingStats } from "@/domains/meeting/apis/meeting-api";

export function getMeetingStatsQueryKey() {
  return ["meeting", "stats"];
}

export function useMeetingStatsQuery() {
  return useQuery({
    queryFn: async () => {
      const { data } = await getMeetingStats();
      return data.data;
    },
    queryKey: getMeetingStatsQueryKey(),
    staleTime: 5 * 60 * 1000,
  });
}
