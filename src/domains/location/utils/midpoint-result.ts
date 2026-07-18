import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";

const NEARBY_MAX_ROUTE_DURATION_MINUTES = 15;
const NEARBY_MAX_AVG_DURATION_GAP_MINUTES = 5;

export function isNearbyDepartureResult(
  recommendations: StationRecommendationDto[],
) {
  if (recommendations.length < 2) return false;

  const sorted = [...recommendations].sort((a, b) => a.rank - b.rank);
  const topRecommendations = sorted.slice(0, 3);
  const avgDurations = topRecommendations.map(
    (station) => station.avgTransitDuration,
  );
  const avgDurationGap = Math.max(...avgDurations) - Math.min(...avgDurations);
  const topStation = topRecommendations[0];
  if (topStation.routes.length === 0) return false;

  const allRoutesShort = topStation.routes.every(
    (route) =>
      route.transitReachable !== false &&
      route.transitDuration <= NEARBY_MAX_ROUTE_DURATION_MINUTES,
  );

  return (
    avgDurationGap <= NEARBY_MAX_AVG_DURATION_GAP_MINUTES && allRoutesShort
  );
}
