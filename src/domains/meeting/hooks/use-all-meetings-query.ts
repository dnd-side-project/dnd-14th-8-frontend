import { useQuery } from "@tanstack/react-query";
import { getAllMeetings } from "@/domains/meeting/apis/meeting-api";

export function getAllMeetingsQueryKey() {
  return ["meeting", "all"];
}

export function useAllMeetingsQuery() {
  return useQuery({
    queryFn: () => getAllMeetings().then(({ data }) => data.data),
    queryKey: getAllMeetingsQueryKey(),
  });
}
