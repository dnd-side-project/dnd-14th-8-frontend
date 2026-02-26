import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  type GetMidpointRecommendationsParams,
  getMidpointRecommendations,
} from "@/domains/location/apis/location-api";

export function getMidpointRecommendationsQueryKey({
  meetingId,
}: {
  meetingId: string;
}) {
  return ["locations", "midpoint-recommendations", meetingId];
}

export function useGetMidpointRecommendations({
  meetingId,
  departureTime,
}: GetMidpointRecommendationsParams) {
  return useQuery({
    queryFn: async () => {
      try {
        const { data } = await getMidpointRecommendations({
          meetingId,
          departureTime,
        });
        return data.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          return null;
        }

        throw error;
      }
    },
    queryKey: getMidpointRecommendationsQueryKey({ meetingId }),
    staleTime: 30 * 1000,
    enabled: !!meetingId,
  });
}
