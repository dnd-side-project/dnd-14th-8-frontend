import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LandingPage } from "@/domains/meeting/pages";

const useMyMeetingsQueryMock = vi.fn();

vi.mock("@/domains/meeting/hooks/use-meeting-stats-query", () => ({
  useMeetingStatsQuery: () => ({
    data: { todayCreatedMeetingCount: 0 },
  }),
}));

vi.mock("@/domains/meeting/hooks/use-my-meetings-query", () => ({
  useMyMeetingsQuery: () => useMyMeetingsQueryMock(),
}));

describe("LandingPage", () => {
  beforeEach(() => {
    useMyMeetingsQueryMock.mockReturnValue({
      data: [],
      isError: false,
      isPending: false,
    });
  });

  it("renders recently joined meetings when my meeting data exists", () => {
    useMyMeetingsQueryMock.mockReturnValue({
      data: [
        {
          createdAt: "2026-07-23T14:10:00",
          hostName: "민수",
          isHost: true,
          meetingId: "meeting-id",
          participantCount: 4,
        },
      ],
      isError: false,
      isPending: false,
    });

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(markup).toContain("최근 모임");
    expect(markup).toContain("민수님의 모임");
  });

  it("does not render the recent meetings section when my meeting data is empty", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(markup).not.toContain("최근 모임");
  });

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
