export function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1_000) {
    return `${distanceMeters}m`;
  }

  const km = distanceMeters / 1_000;
  const rounded = Number.isInteger(km) ? String(km) : km.toFixed(1);

  return `${rounded}km`;
}

export function formatDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function formatDepartureDateTime(isoDateTime?: string | null) {
  if (!isoDateTime) return "출발 시간 선택";

  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "출발 시간 선택";

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${month}월 ${day}일 ${hour}:${minute} 출발`;
}
