import { useQuery } from "@tanstack/react-query";
import { listParticipants } from "@/domains/meeting/apis/participant-api";

export function listParticipantsQueryKey({ meetingId }: { meetingId: string }) {
  return ["participants", meetingId];
}

export function useListParticipants({ meetingId }: { meetingId: string }) {
  return useQuery({
    queryFn: async () => {
      const { data } = await listParticipants({ meetingId });
      return data.data;
    },
    queryKey: listParticipantsQueryKey({ meetingId }),
    staleTime: 30 * 1000,
  });
}
