export interface CreateScheduleVoteRequest {
  localStorageKey: string;
  participantName: string;
  votedDates: string[];
}

export interface UpdateScheduleVoteRequest {
  participantId?: number;
  participantName?: string;
  votedDates?: string[];
}

export interface UpdateSchedulePollRequest {
  dateOptions: string[];
  endTime: string;
  startTime: string;
}
