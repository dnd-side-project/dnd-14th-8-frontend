import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  type GetPersonalRouteParams,
  getPersonalRoute,
} from "@/domains/location/apis/location-api";
import { getApiErrorShape } from "@/shared/utils/api-error";

export function getPersonalRouteQueryKey({
  meetingId,
  stationId,
  participantId,
  departureTime,
  mode,
}: GetPersonalRouteParams) {
  return [
    "locations",
    "personal-route",
    meetingId,
    stationId,
    participantId,
    departureTime,
    mode,
  ];
}

export function useGetPersonalRoute(params: GetPersonalRouteParams) {
  const { meetingId, stationId, participantId, departureTime, mode } = params;

  return useQuery({
    queryKey: getPersonalRouteQueryKey(params),
    queryFn: async () => {
      try {
        const { data } = await getPersonalRoute({
          meetingId,
          stationId,
          participantId,
          departureTime,
          mode,
        });

        return data.data;
      } catch (error) {
        const apiError = getApiErrorShape(error);

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404 &&
          (apiError?.code === "E414" || apiError?.code === "E415")
        ) {
          return null;
        }

        throw error;
      }
    },
    enabled: !!meetingId && !!stationId && !!participantId,
    staleTime: 30 * 1000,
  });
}
