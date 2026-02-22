import { useQuery } from "@tanstack/react-query";
import { getMeetingSchedules } from "@/domains/meeting/apis/meeting-api";

export function getMeetingSchedulesQueryKey({
  meetingId,
}: {
  meetingId: string;
}) {
  return ["meeting", "schedules", meetingId];
}

export function useGetMeetingSchedules({ meetingId }: { meetingId: string }) {
  return useQuery({
    queryFn: async () => {
      const { data } = await getMeetingSchedules({ meetingId });
      return data.data;
    },
    queryKey: getMeetingSchedulesQueryKey({ meetingId }),
    staleTime: 30 * 1000,
  });
}
