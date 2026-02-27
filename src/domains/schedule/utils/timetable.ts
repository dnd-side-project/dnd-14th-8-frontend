import type { ScheduleParticipant } from "@/domains/meeting/types/meeting-api-types";

/**
 * 서버가 Z 없이 반환하는 날자 문자열을 UTC로 파싱하는 함수
 */
export function parseVotedDateUTC(dateStr: string): Date {
  if (!dateStr.endsWith("Z") && !dateStr.includes("+")) {
    return new Date(`${dateStr}Z`);
  }

  return new Date(dateStr);
}

/**
 * participants의 votedDates로부터 슬롯별 투표 수(occupancy)를 계산하는 함수
 */
export function toOccupancyFromParticipants(
  participants: ScheduleParticipant[],
) {
  const occupancy: Record<string, number> = {};

  for (const participant of participants) {
    for (const votedDate of participant.votedDates) {
      const date = parseVotedDateUTC(votedDate);

      if (Number.isNaN(date.getTime())) {
        continue;
      }

      const key = date.getTime().toString();
      occupancy[key] = (occupancy[key] ?? 0) + 1;
    }
  }

  return occupancy;
}

/**
 * 특정 참여자의 votedDates를 Date 배열로 변환하는 함수
 */
export function getParticipantVotedDates(
  participants: ScheduleParticipant[],
  participantName: string,
): Date[] {
  const participant = participants.find((p) => p.name === participantName);
  return (
    participant?.votedDates
      .map(parseVotedDateUTC)
      .filter((d) => !Number.isNaN(d.getTime())) || []
  );
}
