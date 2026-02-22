export type CoordinateValue = number | string;

export interface CreateLocationVoteRequest {
  departureLat: CoordinateValue;
  departureLng: CoordinateValue;
  departureLocation: string;
  localStorageKey?: string;
  locationPollId: string;
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
  departureLat: number;
  departureLng: number;
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
  participantId: number;
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
  stationId: number;
  stationName: string;
}

export interface MidpointRecommendationResponse {
  centerPoint: CenterPointDto;
  departureTime?: string;
  recommendations: StationRecommendationDto[];
}

export interface PlaceDetail {
  businessStatusMessage: string;
  distanceFromBase: number;
  formattedAddress: string;
  id: number;
  isOpen: boolean;
  kakaoPlaceUrl: string;
  latitude: number;
  longitude: number;
  name: string;
}

export interface CategoryPlaces {
  category: string;
  places: PlaceDetail[];
}

export interface NearbyPlaceSearchResponse {
  categories: CategoryPlaces[];
}

export interface ParticipantSummaryDto {
  departureAddress: string;
  participantId: number;
  participantName: string;
}

export interface StationSummaryDto {
  line: string;
  stationId: number;
  stationName: string;
}

export interface TransitRouteDetailDto {
  distanceMeters: number;
  durationMinutes: number;
  fare: number;
  transferCount: number;
  walkDistanceMeters: number;
}

export interface DrivingRouteDetailDto {
  distanceMeters: number;
  durationMinutes: number;
  estimatedTaxiFare: number;
  tollFare: number;
}

export interface PersonalRouteResponse {
  departureTime?: string;
  driving?: DrivingRouteDetailDto;
  participant: ParticipantSummaryDto;
  station: StationSummaryDto;
  transit?: TransitRouteDetailDto;
}

export type MidpointRouteMode = "both" | "driving" | "transit";
