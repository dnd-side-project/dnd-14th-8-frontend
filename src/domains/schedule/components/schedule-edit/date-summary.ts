import { differenceInCalendarDays, format } from "date-fns";

export type ScheduleDateSummary = {
  label: string;
  overflow: number;
};

function formatDate(date: Date) {
  return format(date, "M.d");
}

function getSortedUniqueDates(dates: Date[]) {
  const uniqueDates = new Map<string, Date>();
  for (const date of dates) {
    uniqueDates.set(format(date, "yyyy-MM-dd"), date);
  }

  return [...uniqueDates.values()].sort((a, b) => a.getTime() - b.getTime());
}

function getConsecutiveDates(dates: Date[]) {
  let consecutiveEndIndex = 0;
  for (let index = 1; index < dates.length; index += 1) {
    const previousDate = dates[index - 1];
    const currentDate = dates[index];

    if (differenceInCalendarDays(currentDate, previousDate) === 1) {
      consecutiveEndIndex = index;
    } else {
      break;
    }
  }

  return dates.slice(0, consecutiveEndIndex + 1);
}

export function getScheduleDateSummary(dates: Date[]): ScheduleDateSummary {
  const sortedDates = getSortedUniqueDates(dates);
  if (sortedDates.length === 0) {
    return { label: "-", overflow: 0 };
  }

  if (sortedDates.length === 1) {
    return { label: formatDate(sortedDates[0]), overflow: 0 };
  }

  const consecutiveDates = getConsecutiveDates(sortedDates);
  if (consecutiveDates.length > 1) {
    const from = formatDate(consecutiveDates[0]);
    const to = formatDate(consecutiveDates[consecutiveDates.length - 1]);
    return {
      label: `${from} - ${to}`,
      overflow: sortedDates.length - consecutiveDates.length,
    };
  }

  const previewCount = Math.min(sortedDates.length, 2);
  return {
    label: sortedDates.slice(0, previewCount).map(formatDate).join(", "),
    overflow: sortedDates.length - previewCount,
  };
}
