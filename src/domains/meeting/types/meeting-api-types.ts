export interface CreateMeetingRequest {
  flow?: MeetingFlow;
  localStorageKey: string;
  participantCount?: number;
  participantName: string;
}

export interface UpdateMeetingRequest {
  localStorageKey: string;
  meetingId: string;
  participantCount?: number;
}

export interface LandingStatsResponse {
  todayCreatedMeetingCount: number;
}

export type MeetingFlow = "SCHEDULE" | "LOCATION";

export interface MyMeetingResponse {
  availableFlows?: MeetingFlow[];
  createdAt: string;
  hostName: string;
  isHost: boolean;
  meetingId: string;
  participantCount: number;
}

export interface ScheduleParticipant {
  name: string;
  votedDates: string[];
}

export interface GetMeetingScheduleResponse {
  dateOptions: string[];
  endTime: string;
  meetingId: string;
  participantCount: number;
  participants: ScheduleParticipant[];
  startTime: string;
  votedParticipantCount: number;
  pollStatus: string;
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
