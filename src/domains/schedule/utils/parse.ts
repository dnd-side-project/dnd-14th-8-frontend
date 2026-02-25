export function parseTime(value: string, fallback: number) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);

  if (!Number.isFinite(hour)) {
    return fallback;
  }

  const minute = Number(minuteText ?? "0");
  const total = hour + (Number.isFinite(minute) ? minute / 60 : 0);

  return Math.min(24, Math.max(0, total));
}
