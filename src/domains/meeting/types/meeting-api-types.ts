import type { ParticipantResponse } from "@/domains/meeting/types/participant-api-types";

export interface CreateMeetingRequest {
  localStorageKey: string;
  participantCount?: number;
  participantName: string;
}

export interface UpdateMeetingRequest {
  localStorageKey: string;
  meetingId: string;
  participantCount?: number;
}

export interface GetMeetingScheduleResponse {
  dateOptions: string[];
  endTime: string;
  meetingId: string;
  participantCount: number;
  participants: ParticipantResponse[];
  startTime: string;
  votedParticipantCount: number;
}

export interface ScheduleVoteResult {
  availableParticipantNames: string[];
  endTime: string;
  scheduleDate: string;
  scheduleDayOfWeek: string;
  startTime: string;
  unavailableParticipantNames: string[];
  voteCount: number;
}

export interface GetMeetingScheduleVoteResultResponse {
  participantCount: number;
  resultCount: number;
  scheduleVoteResult: ScheduleVoteResult[];
}
