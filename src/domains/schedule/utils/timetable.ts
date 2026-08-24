import type { ScheduleParticipant } from "@/domains/meeting/types/meeting-api-types";

const WALL_CLOCK_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/;

/**
 * 서버가 내려주는 투표 시각을 Asia/Seoul 벽시계 그대로 읽는 함수.
 *
 * 서버는 LocalDateTime을 오프셋 없이 직렬화하므로 표기된 시각이 곧 사용자가
 * 고른 슬롯이다. 오프셋이 붙어 오더라도 서버가 의도한 값은 벽시계 시각이라
 * 오프셋은 무시한다.
 */
export function parseVotedDate(dateStr: string): Date {
  const matched = WALL_CLOCK_PATTERN.exec(dateStr);

  if (!matched) {
    return new Date(Number.NaN);
  }

  const [, year, month, day, hour, minute, second] = matched;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? 0),
  );
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
      const date = parseVotedDate(votedDate);

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
      .map(parseVotedDate)
      .filter((d) => !Number.isNaN(d.getTime())) || []
  );
}
