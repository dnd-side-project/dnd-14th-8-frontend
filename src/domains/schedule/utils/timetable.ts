import type { ScheduleVoteResult } from "@/domains/meeting/types/meeting-api-types";

export function parseScheduleSlotDate(dateText: string, timeText: string) {
  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const [hoursText, minutesText] = timeText.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText ?? "0");

  if (Number.isFinite(hours) && Number.isFinite(minutes)) {
    date.setHours(hours, minutes, 0, 0);
  }

  return date;
}

export function toScheduleOccupancy(results: ScheduleVoteResult[]) {
  const occupancy: Record<string, number> = {};

  for (const result of results) {
    const from = parseScheduleSlotDate(result.scheduleDate, result.startTime);
    const to = parseScheduleSlotDate(result.scheduleDate, result.endTime);

    if (!from || !to) {
      continue;
    }

    const current = new Date(from);
    while (current < to) {
      const key = current.getTime().toString();
      occupancy[key] = Math.max(occupancy[key] ?? 0, result.voteCount);
      current.setMinutes(current.getMinutes() + 30);
    }
  }

  return occupancy;
}
