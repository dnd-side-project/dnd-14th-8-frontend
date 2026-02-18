export type CoordinateValue = number | string;

export interface CreateLocationVoteRequest {
  departureLat: CoordinateValue;
  departureLng: CoordinateValue;
  departureLocation: string;
  localStorageKey?: string;
  locationPollId: number | string;
  meetingId: string;
  participantName: string;
}

export interface UpdateLocationVoteRequest {
  departureLat: CoordinateValue;
  departureLng: CoordinateValue;
  departureLocation: string;
  participantName: string;
}

export interface LocationVote {
  departureLat: CoordinateValue;
  departureLng: CoordinateValue;
  departureLocation: string;
  locationVoteId: number;
  participantName: string;
}

export interface CenterPointDto {
  latitude: number;
  longitude: number;
}

export interface RouteDto {
  departureAddress: string;
  departureName: string;
  drivingDistance: number;
  drivingDuration: number;
  transitDistance: number;
  transitDuration: number;
}

export interface StationRecommendationDto {
  avgTransitDuration: number;
  distanceFromCenter: number;
  latitude: number;
  line: string;
  longitude: number;
  rank: number;
  routes: RouteDto[];
  stationName: string;
}

export interface MidpointRecommendationResponse {
  centerPoint: CenterPointDto;
  recommendations: StationRecommendationDto[];
}

export interface OptimalLocationParticipantByCoordinates {
  latitude: number;
  longitude: number;
  name: string;
}

export interface OptimalLocationParticipantBySchema {
  isHost: boolean;
  name: string;
  participantId: number;
}

export type OptimalLocationParticipant =
  | OptimalLocationParticipantByCoordinates
  | OptimalLocationParticipantBySchema;

export interface OptimalLocationRequest {
  participants: OptimalLocationParticipant[];
}

export interface OptimalLocationRoute {
  distance: number;
  duration: number;
  participantName: string;
  payment: number;
  transitCount: number;
}

export interface OptimalLocationRecommendation {
  address: string;
  avgDuration: number;
  category: string;
  distanceFromCenter: number;
  latitude: number;
  longitude: number;
  minMax: number;
  minSum: number;
  name: string;
  rank: number;
  routes: OptimalLocationRoute[];
}

export interface OptimalLocationResponse {
  centerPoint: CenterPointDto;
  recommendations: OptimalLocationRecommendation[];
}
