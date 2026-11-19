export function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1_000) {
    return `${distanceMeters}m`;
  }

  const km = distanceMeters / 1_000;
  const rounded = Number.isInteger(km) ? String(km) : km.toFixed(1);

  return `${rounded}km`;
}

export interface DurationPart {
  value: number;
  unit: "시간" | "분";
}

/**
 * 시간을 숫자와 단위로 나눈다. 숫자와 단위의 글자 크기가 다른 곳(역 카드)에서 쓴다.
 * 1시간이 안 되면 분만, 분이 0으로 떨어지면 시간만 돌려준다("1시간 0분"이 아니라 "1시간").
 */
export function getDurationParts(durationMinutes: number): DurationPart[] {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const hourPart: DurationPart = { value: hours, unit: "시간" };
  const minutePart: DurationPart = { value: minutes, unit: "분" };

  if (hours === 0) return [minutePart];
  if (minutes === 0) return [hourPart];
  return [hourPart, minutePart];
}

export function formatDuration(durationMinutes: number) {
  return getDurationParts(durationMinutes)
    .map(({ value, unit }) => `${value}${unit}`)
    .join(" ");
}

/**
 * 역 이름 뒤에 "역"을 붙인다. 백엔드 역 이름에는 "역"이 없다("을지로3가").
 * 이미 "역"으로 끝나는 이름("서울역")은 그대로 둔다.
 */
export function formatStationName(stationName: string) {
  const name = stationName.trim();
  if (!name || name.endsWith("역")) return name;

  return `${name}역`;
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
