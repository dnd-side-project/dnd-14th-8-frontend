export function formatDistance(distanceMeters: number) {
  const km = distanceMeters / 1_000;
  return km > 0 ? `${km}km` : `${distanceMeters}m`;
}

export function formatDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}
