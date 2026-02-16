import type {
  ListParticipantResponse,
  ParticipantResponse,
} from "@/domains/meeting/types/participant-api-types";
import { type ApiResponse, api } from "@/shared/utils/axios";

export interface GetMyParticipantParams {
  localStorageKey: string;
  meetingId: string;
}

export interface ListParticipantsParams {
  meetingId: string;
}

export function listParticipants({ meetingId }: ListParticipantsParams) {
  return api.get<ApiResponse<ListParticipantResponse>>("/api/participants", {
    params: { meetingId },
  });
}

export function getMyParticipant({
  localStorageKey,
  meetingId,
}: GetMyParticipantParams) {
  return api.get<ApiResponse<ParticipantResponse>>("/api/participants/me", {
    params: { localStorageKey, meetingId },
  });
}
