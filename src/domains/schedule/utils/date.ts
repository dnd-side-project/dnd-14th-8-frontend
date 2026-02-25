import { addDays, isSameDay, startOfDay } from "date-fns";

export const areDatesEqual = (datesA: Date[], datesB: Date[]) => {
  if (datesA.length !== datesB.length) return false;
  const sortedA = [...datesA].sort((a, b) => a.getTime() - b.getTime());
  const sortedB = [...datesB].sort((a, b) => a.getTime() - b.getTime());
  return sortedA.every((date, index) => isSameDay(date, sortedB[index]));
};

export const getNextDays = (count: number) => {
  const today = startOfDay(new Date());
  return Array.from({ length: count }, (_, i) => addDays(today, i));
};

export const timeOptions = Array.from({ length: 49 }, (_, i) => {
  const hour = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});
