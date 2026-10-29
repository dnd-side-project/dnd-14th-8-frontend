import axios from "axios";
import type { CreateLocationVoteRequest } from "@/domains/location/types/location-api-types";

// 백엔드 createLocationVote의 중복 등록 에러 코드
// E413: localStorageKey 중복(이미 참여한 사용자), E430: 지정한 참여자가 이미 출발지 등록
const DUPLICATE_DEPARTURE_ERROR_CODES = ["E413", "E430"];

export const DUPLICATE_DEPARTURE_MESSAGE = "이미 출발지를 등록한 참여자예요";

interface BuildCreateDepartureRequestParams {
  departureLat: string;
  departureLng: string;
  departureLocation: string;
  guestId: string;
  hasMyLocationVote: boolean;
  meetingId: string;
  participantId?: string;
  participantName: string;
}

/**
 * 백엔드 분기 규약에 맞춰 출발지 추가 payload를 구성한다.
 * - participantId 지정: 해당 참여자에게 투표 연결 (대리/본인 선택 등록)
 * - 미지정 + 내 출발지 있음: 참가자 미연결 수동 추가 (localStorageKey 생략)
 * - 미지정 + 내 출발지 없음: 본인 첫 등록 (localStorageKey 전송)
 */
export function buildCreateDepartureRequest({
  departureLat,
  departureLng,
  departureLocation,
  guestId,
  hasMyLocationVote,
  meetingId,
  participantId,
  participantName,
}: BuildCreateDepartureRequestParams): CreateLocationVoteRequest {
  const base: CreateLocationVoteRequest = {
    departureLat,
    departureLng,
    departureLocation,
    meetingId,
    participantName,
  };

  if (participantId) {
    return { ...base, participantId: Number(participantId) };
  }

  if (hasMyLocationVote) {
    return base;
  }

  return { ...base, localStorageKey: guestId };
}

export function isDuplicateDepartureError(error: unknown) {
  return (
    axios.isAxiosError<{ code?: string }>(error) &&
    DUPLICATE_DEPARTURE_ERROR_CODES.includes(error.response?.data?.code ?? "")
  );
}
