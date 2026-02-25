import { useQuery } from "@tanstack/react-query";
import { getMeetingScheduleVoteResults } from "@/domains/meeting/apis/meeting-api";

export function getMeetingScheduleVoteResultsQueryKey({
  meetingId,
}: {
  meetingId: string;
}) {
  return ["meeting", "schedule-vote-results", meetingId];
}

export function useGetMeetingScheduleVoteResults({
  meetingId,
}: {
  meetingId: string;
}) {
  return useQuery({
    queryFn: async () => {
      const { data } = await getMeetingScheduleVoteResults({ meetingId });
      return data.data;
    },
    queryKey: getMeetingScheduleVoteResultsQueryKey({ meetingId }),
    staleTime: 30 * 1000,
  });
}
