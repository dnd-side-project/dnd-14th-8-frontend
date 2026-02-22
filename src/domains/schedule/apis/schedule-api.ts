import type {
  CreateScheduleVoteRequest,
  UpdateSchedulePollRequest,
  UpdateScheduleVoteRequest,
} from "@/domains/schedule/types/schedule-api-types";
import { type ApiResponse, api } from "@/shared/utils/axios";

export interface ConfirmSchedulePollParams {
  meetingId: string;
}

export interface CreateScheduleVoteParams {
  meetingId: string;
  payload: CreateScheduleVoteRequest;
}

export interface UpdateSchedulePollParams {
  meetingId: string;
  payload: UpdateSchedulePollRequest;
}

export interface UpdateScheduleVoteParams {
  payload: UpdateScheduleVoteRequest;
  scheduleVoteId: number;
}

export function createScheduleVote({
  meetingId,
  payload,
}: CreateScheduleVoteParams) {
  return api.post<ApiResponse<void>>("/api/schedules/vote", payload, {
    params: { meetingId },
  });
}

export function updateScheduleVote({
  payload,
  scheduleVoteId,
}: UpdateScheduleVoteParams) {
  return api.put<ApiResponse<void>>(
    `/api/schedules/vote/${scheduleVoteId}`,
    payload,
  );
}

export function updateSchedulePoll({
  meetingId,
  payload,
}: UpdateSchedulePollParams) {
  return api.put<ApiResponse<void>>("/api/schedules/poll", payload, {
    params: { meetingId },
  });
}

export function confirmSchedulePoll({ meetingId }: ConfirmSchedulePollParams) {
  return api.put<ApiResponse<void>>("/api/schedules/poll/confirm", undefined, {
    params: { meetingId },
  });
}
