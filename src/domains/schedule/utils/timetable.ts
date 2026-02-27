import type { ScheduleParticipant } from "@/domains/meeting/types/meeting-api-types";

/**
 * 서버가 Z 접미사를 제거하여 반환하는 votedDate 문자열을 UTC로 파싱한다.
 *
 * - 서버 저장: `"2026-02-27T00:00:00.000Z"` (UTC)
 * - 서버 응답: `"2026-02-27T00:00:00"` (Z 제거됨)
 * - `new Date("…T00:00:00")` → 로컬 자정으로 해석 (KST 기준 9시간 오차)
 * - `new Date("…T00:00:00Z")` → UTC 자정으로 올바르게 해석
 */
export function parseVotedDateUTC(dateStr: string): Date {
  if (!dateStr.endsWith("Z") && !dateStr.includes("+")) {
    return new Date(`${dateStr}Z`);
  }

  return new Date(dateStr);
}

/**
 * participants의 votedDates로부터 슬롯별 투표 수(occupancy)를 계산한다.
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
 * 특정 참여자의 votedDates를 Date 배열로 변환한다.
 */
export function getParticipantVotedDates(
  participants: ScheduleParticipant[],
  participantName: string,
): Date[] {
  const participant = participants.find((p) => p.name === participantName);

  if (!participant) {
    return [];
  }

  return participant.votedDates
    .map(parseVotedDateUTC)
    .filter((d) => !Number.isNaN(d.getTime()));
}
