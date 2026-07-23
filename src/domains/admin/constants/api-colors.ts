import type { ExternalApiTag } from "@/domains/admin/types/external-api-stats-types";

/** 차트에서 API를 구분하는 범주형 색상 (라이트 테마 기준, 접근성 고려한 명도차). */
export const API_COLORS: Record<ExternalApiTag, string> = {
  odsay: "#4f46e5",
  kakao_local: "#0891b2",
  kakao_directions: "#7c3aed",
  google_routes: "#ea580c",
};
