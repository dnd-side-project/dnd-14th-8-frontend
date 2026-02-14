import { eachDayOfInterval, format, isAfter } from "date-fns";
import type { Modifiers } from "react-day-picker";

export type DragSelectionMode = "add" | "remove";

export type CalendarDayMeta = {
  date: Date;
  isBlocked: boolean;
  isSelected: boolean;
};

export function getCalendarDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function parseCalendarDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getRangeDates(from: Date, to: Date) {
  if (isAfter(from, to)) {
    return eachDayOfInterval({ start: to, end: from });
  } else {
    return eachDayOfInterval({ start: from, end: to });
  }
}

export function isBlockedDay(modifiers: Modifiers) {
  return modifiers.disabled || modifiers.hidden;
}

export function getCalendarDayMeta(
  calendarId: string,
  target: EventTarget | null,
): CalendarDayMeta | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const calendarRoot = document.getElementById(calendarId);
  if (!calendarRoot) {
    return null;
  }

  const dayCell = target.closest<HTMLElement>("[data-day]");
  if (!dayCell || !calendarRoot.contains(dayCell)) {
    return null;
  }

  const dateKey = dayCell.dataset.day;
  if (!dateKey) {
    return null;
  }

  return {
    date: parseCalendarDateKey(dateKey),
    isBlocked:
      dayCell.dataset.disabled === "true" || dayCell.dataset.hidden === "true",
    isSelected: dayCell.dataset.selected === "true",
  };
}

export function getDraggedSelection(
  baseDates: Date[],
  startDate: Date,
  currentDate: Date,
  dragMode: DragSelectionMode,
) {
  const rangeDates = getRangeDates(startDate, currentDate);

  if (dragMode === "remove") {
    const keys = new Set(rangeDates.map(getCalendarDateKey));
    return baseDates.filter((date) => !keys.has(getCalendarDateKey(date)));
  } else {
    return [...baseDates, ...rangeDates];
  }
}
