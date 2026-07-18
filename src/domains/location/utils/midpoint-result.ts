import type {
  LocationVote,
  StationRecommendationDto,
} from "@/domains/location/types/location-api-types";

const NEARBY_MAX_ROUTE_DURATION_MINUTES = 15;
const NEARBY_MAX_AVG_DURATION_GAP_MINUTES = 5;
const NEARBY_MAX_DEPARTURE_DISTANCE_METERS = 2000;

export function isNearbyDepartureResult(
  recommendations: StationRecommendationDto[],
  departures: LocationVote[] = [],
) {
  if (recommendations.length === 0) return false;

  const sorted = [...recommendations].sort((a, b) => a.rank - b.rank);
  const topRecommendations = sorted.slice(0, 3);
  const topStation = topRecommendations[0];
  if (topStation.routes.length === 0) return false;

  const allRoutesShort = topStation.routes.every(
    (route) =>
      route.transitReachable !== false &&
      route.transitDuration <= NEARBY_MAX_ROUTE_DURATION_MINUTES,
  );

  if (!allRoutesShort) return false;

  if (departures.length >= 2) {
    return areDeparturesClose(departures);
  }

  if (recommendations.length < 2) return false;

  const avgDurations = topRecommendations.map(
    (station) => station.avgTransitDuration,
  );
  const avgDurationGap = Math.max(...avgDurations) - Math.min(...avgDurations);

  return avgDurationGap <= NEARBY_MAX_AVG_DURATION_GAP_MINUTES;
}

function areDeparturesClose(departures: LocationVote[]) {
  for (let sourceIndex = 0; sourceIndex < departures.length; sourceIndex += 1) {
    const source = departures[sourceIndex];
    for (
      let targetIndex = sourceIndex + 1;
      targetIndex < departures.length;
      targetIndex += 1
    ) {
      const target = departures[targetIndex];
      if (
        haversineDistance(
          source.departureLat,
          source.departureLng,
          target.departureLat,
          target.departureLng,
        ) > NEARBY_MAX_DEPARTURE_DISTANCE_METERS
      ) {
        return false;
      }
    }
  }

  return true;
}

function haversineDistance(
  sourceLat: number,
  sourceLng: number,
  targetLat: number,
  targetLng: number,
) {
  const earthRadiusMeters = 6_371_000;
  const sourcePhi = toRadians(sourceLat);
  const targetPhi = toRadians(targetLat);
  const deltaPhi = toRadians(targetLat - sourceLat);
  const deltaLambda = toRadians(targetLng - sourceLng);

  const halfChordLength =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(sourcePhi) *
      Math.cos(targetPhi) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const angularDistance =
    2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return earthRadiusMeters * angularDistance;
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
