import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ApiSummaryCard } from "@/domains/admin/components/api-summary-card";
import type { ApiSummary } from "@/domains/admin/types/external-api-stats-types";

const odsay: ApiSummary = {
  api: "odsay",
  calls: 420,
  success: 416,
  failure: 4,
  successRate: 99.0,
  rateLimited: 37,
  p95Ms: 840,
  dailyQuota: 1000,
  quotaRemaining: 580,
  todayCostUsd: null,
};

const google: ApiSummary = {
  api: "google_routes",
  calls: 3540,
  success: 3480,
  failure: 60,
  successRate: 98.3,
  rateLimited: 0,
  p95Ms: 990,
  dailyQuota: null,
  quotaRemaining: null,
  todayCostUsd: 0.265,
};

describe("ApiSummaryCard", () => {
  it("renders quota remaining and a 429 badge for a quota-limited API", () => {
    const markup = renderToStaticMarkup(<ApiSummaryCard summary={odsay} />);

    expect(markup).toContain("ODsay");
    expect(markup).toContain("420");
    expect(markup).toContain("99.0%");
    expect(markup).toContain("840ms");
    expect(markup).toContain("한도 잔여");
    expect(markup).toContain("580");
    expect(markup).toContain("1,000");
    expect(markup).toContain("429");
  });

  it("renders cost instead of quota for Google and hides the 429 badge when zero", () => {
    const markup = renderToStaticMarkup(<ApiSummaryCard summary={google} />);

    expect(markup).toContain("Google Routes");
    expect(markup).toContain("오늘 비용");
    expect(markup).toContain("$0.265");
    expect(markup).not.toContain("한도 잔여");
    expect(markup).not.toContain("429 ·");
  });
});
