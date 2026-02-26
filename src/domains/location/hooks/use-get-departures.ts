import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getDepartures } from "@/domains/location/apis/location-api";

export function getDeparturesQueryKey({ meetingId }: { meetingId: string }) {
  return ["locations", "vote", meetingId];
}

export function useGetDepartures({ meetingId }: { meetingId: string }) {
  return useQuery({
    queryKey: getDeparturesQueryKey({ meetingId }),
    queryFn: async () => {
      try {
        const { data } = await getDepartures({ meetingId });

        return data.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
    staleTime: 30 * 1000,
    enabled: !!meetingId,
  });
}
