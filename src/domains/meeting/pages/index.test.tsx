import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { LandingPage } from "@/domains/meeting/pages";

vi.mock("@/domains/meeting/hooks/use-meeting-stats-query", () => ({
  useMeetingStatsQuery: () => ({
    data: { todayCreatedMeetingCount: 0 },
  }),
}));

describe("LandingPage", () => {
  it("renders the service contact email on the landing page", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(markup).toContain("서비스 이용 중 문의나 오류가 있다면");
    expect(markup).toContain("moyeorak.team@gmail.com");
  });
});
