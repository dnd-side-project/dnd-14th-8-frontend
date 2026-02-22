import type {
  CoordinateValue,
  CreateLocationVoteRequest,
  LocationVote,
  MidpointRecommendationResponse,
  PersonalRouteResponse,
  UpdateLocationVoteRequest,
} from "@/domains/location/types/location-api-types";
import { type ApiResponse, api } from "@/shared/utils/axios";

interface CreateLocationVoteRequestBody {
  departureLat: string;
  departureLng: string;
  departureLocation: string;
  localStorageKey?: string;
  locationPollId: string;
  meetingId: string;
  participantName: string;
}

interface UpdateLocationVoteRequestBody {
  departureLat: string;
  departureLng: string;
  departureLocation: string;
  participantName: string;
}

export type MidpointRouteMode = "both" | "driving" | "transit";

export interface DeleteLocationVoteParams {
  locationVoteId: number;
}

export interface GetMidpointRecommendationsParams {
  departureTime?: string;
  meetingId: string;
}

export interface GetPersonalRouteParams {
  departureTime?: string;
  meetingId: string;
  mode?: MidpointRouteMode;
  participantId: number;
  stationId: number;
}

export interface ListLocationVotesParams {
  locationPollId: number;
}

export interface UpdateLocationVoteParams {
  locationVoteId: number;
  payload: UpdateLocationVoteRequest;
}

function toCoordinateString(value: CoordinateValue) {
  return value.toString();
}

function normalizeCreateLocationVoteRequest(
  payload: CreateLocationVoteRequest,
): CreateLocationVoteRequestBody {
  return {
    ...payload,
    departureLat: toCoordinateString(payload.departureLat),
    departureLng: toCoordinateString(payload.departureLng),
    locationPollId: payload.locationPollId.toString(),
  };
}

function normalizeUpdateLocationVoteRequest(
  payload: UpdateLocationVoteRequest,
): UpdateLocationVoteRequestBody {
  return {
    ...payload,
    departureLat: toCoordinateString(payload.departureLat),
    departureLng: toCoordinateString(payload.departureLng),
  };
}

export function createLocationVote(payload: CreateLocationVoteRequest) {
  return api.post<ApiResponse<void>>(
    "/api/locations/vote",
    normalizeCreateLocationVoteRequest(payload),
  );
}

export function updateLocationVote({
  locationVoteId,
  payload,
}: UpdateLocationVoteParams) {
  return api.put<ApiResponse<void>>(
    `/api/locations/vote/${locationVoteId}`,
    normalizeUpdateLocationVoteRequest(payload),
  );
}

export function deleteLocationVote({
  locationVoteId,
}: DeleteLocationVoteParams) {
  return api.delete<ApiResponse<void>>(`/api/locations/vote/${locationVoteId}`);
}

export function listLocationVotes({ locationPollId }: ListLocationVotesParams) {
  return api.get<ApiResponse<LocationVote[]>>(
    `/api/locations/poll/${locationPollId}/votes`,
  );
}

export function getMidpointRecommendations({
  departureTime,
  meetingId,
}: GetMidpointRecommendationsParams) {
  return api.get<ApiResponse<MidpointRecommendationResponse>>(
    "/api/locations/midpoint-recommendations",
    {
      params: { departureTime, meetingId },
    },
  );
}

export function getPersonalRoute({
  departureTime,
  meetingId,
  mode,
  participantId,
  stationId,
}: GetPersonalRouteParams) {
  return api.get<ApiResponse<PersonalRouteResponse>>(
    "/api/locations/midpoint-routes",
    {
      params: {
        departureTime,
        meetingId,
        mode,
        participantId,
        stationId,
      },
    },
  );
}
