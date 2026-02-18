export interface ParticipantInfo {
  isHost: boolean;
  name: string;
  participantId: number;
}

export interface ListParticipantResponse {
  participants: ParticipantInfo[];
  totalCount: number;
}

export interface ParticipantResponse {
  isHost: boolean;
  localStorageKey: string;
  locationVoteId: number;
  name: string;
  participantId: number;
  scheduleVoteId: number;
}
