import { getNextDays } from "@/domains/schedule/utils/date";

export const DATE_PRESETS = [
  { label: "오늘부터 7일", dates: getNextDays(7) },
  { label: "오늘부터 14일", dates: getNextDays(14) },
  { label: "오늘부터 30일", dates: getNextDays(30) },
];

export const TIME_PRESETS = [
  { label: "9시 ~ 18시", start: "09:00", end: "18:00" },
  { label: "18시 ~ 06시", start: "18:00", end: "06:00" },
  { label: "9시 ~ 24시", start: "09:00", end: "24:00" },
];
