import type {
  CoordinateValue,
  CreateLocationVoteRequest,
  LocationVote,
  MidpointRecommendationResponse,
  OptimalLocationRequest,
  OptimalLocationResponse,
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

export interface DeleteLocationVoteParams {
  locationVoteId: number;
}

export interface GetMidpointRecommendationsParams {
  meetingId: string;
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
  meetingId,
}: GetMidpointRecommendationsParams) {
  return api.get<ApiResponse<MidpointRecommendationResponse>>(
    "/api/locations/midpoint-recommendations",
    {
      params: { meetingId },
    },
  );
}

// 일단은 테스트 API인 것 같지만 추가하고 나중에 교체
export function findOptimalLocations(payload: OptimalLocationRequest) {
  return api.post<ApiResponse<OptimalLocationResponse>>(
    "/api/test/janghh/optimal-location",
    payload,
  );
}
