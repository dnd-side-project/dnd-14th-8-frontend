import type { CenterPointDto } from "@/domains/location/types/location-api-types";

export function toCoordsPath({ latitude, longitude }: CenterPointDto) {
  return `${latitude}x${longitude}`;
}

export function parseCoordsPath(
  coords: string | undefined,
): CenterPointDto | null {
  if (!coords) return null;

  const [latitudeRaw, longitudeRaw] = coords.split("x");
  const latitude = Number(latitudeRaw);
  const longitude = Number(longitudeRaw);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return { latitude, longitude };
}
