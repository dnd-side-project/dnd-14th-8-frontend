export function parseHour(value: string, fallback: number) {
  const [hour] = value.split(":");
  const parsed = Number(hour);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(24, Math.max(0, parsed));
}
