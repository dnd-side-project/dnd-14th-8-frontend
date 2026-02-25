/**
 * 일정 투표 관련 유틸리티 함수
 */

export function normalizeScheduleVoteId(scheduleVoteId?: number) {
  if (!scheduleVoteId || Number.isNaN(scheduleVoteId) || scheduleVoteId <= 0) {
    return undefined;
  }

  return scheduleVoteId;
}

export function toIsoDates(dates: Date[]) {
  return dates.map((date) => date.toISOString());
}
