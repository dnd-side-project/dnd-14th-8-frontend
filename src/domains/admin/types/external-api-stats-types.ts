export type StatsRange = "24h" | "7d" | "30d";

export const STATS_RANGES: StatsRange[] = ["24h", "7d", "30d"];

/** 외부 API 태그 (백엔드 ExternalApi.tag()) */
export type ExternalApiTag =
  | "odsay"
  | "kakao_local"
  | "kakao_directions"
  | "google_routes";

export interface ApiSummary {
  api: ExternalApiTag;
  calls: number;
  success: number;
  failure: number;
  successRate: number;
  rateLimited: number;
  p95Ms: number;
  dailyQuota: number | null;
  quotaRemaining: number | null;
  todayCostUsd: number | null;
}

export interface ExternalApiSummaryResponse {
  asOf: string;
  apis: ApiSummary[];
}

export interface TrendPoint {
  bucketStart: string;
  calls: number;
  failure: number;
  errorRate: number;
  costUsd: number | null;
}

export interface ApiTrend {
  api: ExternalApiTag;
  points: TrendPoint[];
}

export interface ExternalApiTrendsResponse {
  range: string;
  apis: ApiTrend[];
}

export const API_LABELS: Record<ExternalApiTag, string> = {
  odsay: "ODsay",
  kakao_local: "Kakao Local",
  kakao_directions: "Kakao Directions",
  google_routes: "Google Routes",
};
