/**
 * 일정 투표 관련 유틸리티 함수
 */

export function normalizeScheduleVoteId(scheduleVoteId?: number | null) {
  if (!scheduleVoteId || Number.isNaN(scheduleVoteId) || scheduleVoteId <= 0) {
    return undefined;
  }

  return scheduleVoteId;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

/**
 * 서버는 투표 시각을 오프셋 없는 Asia/Seoul 벽시계(LocalDateTime)로 다루고,
 * SchedulePoll의 startTime/endTime도 같은 기준의 분(minute)으로 저장한다.
 * toISOString()으로 UTC를 보내면 두 기준이 9시간 어긋나서
 * 서버가 정상 투표를 시간표 범위 밖으로 판정하고 지운다.
 */
export function toIsoDates(dates: Date[]) {
  return dates.map(
    (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  );
}
