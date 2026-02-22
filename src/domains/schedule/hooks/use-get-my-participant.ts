import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
      try {
        const { data } = await getMyParticipant({ localStorageKey, meetingId });
        return data.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
    queryKey: getMyParticipantQueryKey({ localStorageKey, meetingId }),
    staleTime: 30 * 1000,
  });
}
