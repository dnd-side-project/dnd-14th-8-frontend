import { useQuery } from "@tanstack/react-query";
import { getMyParticipant } from "@/domains/meeting/apis/participant-api";
import { getGuestId } from "@/shared/utils/auth";

export function getMyParticipantQueryKey({
  localStorageKey,
  meetingId,
}: {
  localStorageKey: string;
  meetingId: string;
}) {
  return ["participant", "me", meetingId, localStorageKey];
}

export function useGetMyParticipant({ meetingId }: { meetingId: string }) {
  const localStorageKey = getGuestId();

  return useQuery({
    queryFn: async () => {
      const { data } = await getMyParticipant({ localStorageKey, meetingId });
      return data.data;
    },
    queryKey: getMyParticipantQueryKey({ localStorageKey, meetingId }),
    staleTime: 30 * 1000,
  });
}
