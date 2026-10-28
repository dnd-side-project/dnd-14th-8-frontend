import type {
  CreateMeetingRequest,
  GetMeetingScheduleResponse,
  GetMeetingScheduleVoteResultResponse,
  UpdateMeetingRequest,
} from "@/domains/meeting/types/meeting-api-types";
import { type ApiResponse, api } from "@/shared/utils/axios";

export interface GetMeetingScheduleVoteResultsParams {
  meetingId: string;
}

export interface GetMeetingSchedulesParams {
  meetingId: string;
}

export function createMeeting(payload: CreateMeetingRequest) {
  return api.post<ApiResponse<string>>("/api/meetings", payload);
}

export function updateMeeting(payload: UpdateMeetingRequest) {
  return api.put<ApiResponse<void>>("/api/meetings", payload);
}

export function getMeetingSchedules({ meetingId }: GetMeetingSchedulesParams) {
  return api.get<ApiResponse<GetMeetingScheduleResponse>>(
    `/api/meetings/${meetingId}/schedules`,
  );
}

export function getMeetingScheduleVoteResults({
  meetingId,
}: GetMeetingScheduleVoteResultsParams) {
  return api.get<ApiResponse<GetMeetingScheduleVoteResultResponse>>(
    `/api/meetings/${meetingId}/schedule-vote/results`,
  );
}

export function getAllMeetings() {
  return api.get<ApiResponse<string[]>>("/api/meetings/all");
}
