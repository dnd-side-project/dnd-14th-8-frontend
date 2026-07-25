import { useQuery } from "@tanstack/react-query";
import { getMyMeetings } from "@/domains/meeting/apis/meeting-api";
import { getGuestId } from "@/shared/utils/auth";

export function getMyMeetingsQueryKey(localStorageKey: string) {
  return ["meeting", "me", localStorageKey];
}

export function useMyMeetingsQuery() {
  const localStorageKey = getGuestId();

  return useQuery({
    queryFn: async () => {
      const { data } = await getMyMeetings({ localStorageKey });
      return data.data;
    },
    queryKey: getMyMeetingsQueryKey(localStorageKey),
    staleTime: 30 * 1000,
  });
}
