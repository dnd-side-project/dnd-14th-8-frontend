import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingStatsBadge } from "@/domains/meeting/components/landing-stats-badge";

describe("LandingStatsBadge", () => {
  it("formats and renders today's created meeting count", () => {
    const markup = renderToStaticMarkup(
      <LandingStatsBadge todayCreatedMeetingCount={1234} />,
    );

    expect(markup).toContain("오늘 1,234개의 모임이 만들어졌어요");
    expect(markup).toContain("rounded-full");
  });

  it("renders nothing when the count is zero", () => {
    const markup = renderToStaticMarkup(
      <LandingStatsBadge todayCreatedMeetingCount={0} />,
    );

    expect(markup).toBe("");
  });
});
