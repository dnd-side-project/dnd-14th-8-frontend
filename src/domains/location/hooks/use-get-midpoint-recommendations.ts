import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  type GetMidpointRecommendationsParams,
  getMidpointRecommendations,
} from "@/domains/location/apis/location-api";
import type { MidpointRecommendationResponse } from "@/domains/location/types/location-api-types";
import type { ApiResponse } from "@/shared/utils/axios";

const DEFAULT_CENTER = {
  latitude: 37.5665,
  longitude: 126.978,
};

interface MidpointInsufficientDepartureData {
  registeredCount?: number;
  totalCount?: number;
}

export interface MidpointQueryData
  extends Omit<
    MidpointRecommendationResponse,
    "registeredCount" | "totalCount"
  > {
  /** 무게중심 반경 내 지하철역이 없어 추천 불가 (E417) */
  noNearbyStations?: boolean;
  registeredCount?: number;
  totalCount?: number;
}

function normalizeMidpointResponse(
  response: MidpointRecommendationResponse,
): MidpointRecommendationResponse {
  const registeredCount =
    response.registeredCount ?? response.recommendations.length;
  const totalCount = response.totalCount ?? registeredCount;

  return {
    ...response,
    registeredCount,
    totalCount,
  };
}

export function getMidpointRecommendationsQueryKey({
  meetingId,
  departureTime,
}: {
  meetingId: string;
  departureTime?: string;
}) {
  return ["locations", "midpoint-recommendations", meetingId, departureTime];
}

export function useGetMidpointRecommendations({
  meetingId,
  departureTime,
}: GetMidpointRecommendationsParams) {
  return useQuery({
    queryFn: async (): Promise<MidpointQueryData> => {
      try {
        const { data } = await getMidpointRecommendations({
          meetingId,
          departureTime,
        });

        return normalizeMidpointResponse(data.data);
      } catch (error) {
        // E417: 출발지들의 무게중심 반경 내 지하철역이 없음 (서로 너무 멀리 떨어진 경우)
        if (
          axios.isAxiosError<ApiResponse<unknown>>(error) &&
          error.response?.data?.code === "E417"
        ) {
          return {
            centerPoint: DEFAULT_CENTER,
            departureTime,
            recommendations: [],
            noNearbyStations: true,
          };
        }

        if (
          axios.isAxiosError<ApiResponse<MidpointInsufficientDepartureData>>(
            error,
          ) &&
          error.response?.status === 400 &&
          error.response.data?.code === "E425"
        ) {
          const registeredCount =
            error.response.data.data?.registeredCount ?? 0;
          const totalCount =
            error.response.data.data?.totalCount ?? registeredCount;

          return {
            centerPoint: DEFAULT_CENTER,
            departureTime,
            recommendations: [],
            registeredCount,
            totalCount,
          };
        }

        throw error;
      }
    },
    queryKey: getMidpointRecommendationsQueryKey({
      meetingId,
      departureTime,
    }),
    staleTime: 30 * 1000,
    enabled: !!meetingId,
  });
}
