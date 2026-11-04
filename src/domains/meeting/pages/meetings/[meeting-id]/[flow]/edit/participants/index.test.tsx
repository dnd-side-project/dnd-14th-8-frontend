import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { MeetingEditParticipantsPage } from "@/domains/meeting/pages/meetings/[meeting-id]/[flow]/edit/participants";

const meeting = vi.hoisted(() => ({
  participantCount: 5,
  participants: [] as { name: string; votedDates: string[] }[],
}));

vi.mock("@/domains/schedule/hooks/use-get-meeting-schedules", () => ({
  getMeetingSchedulesQueryKey: () => ["meeting-schedules"],
  useGetMeetingSchedules: () => ({ data: meeting, isLoading: false }),
}));

function renderWithJoined(joinedCount: number) {
  meeting.participants = Array.from({ length: joinedCount }, (_, index) => ({
    name: `참여자${index}`,
    votedDates: [],
  }));
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <MeetingEditParticipantsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("MeetingEditParticipantsPage", () => {
  it("allows counts below the current setting when few people joined", () => {
    const markup = renderWithJoined(2);
    expect(markup).not.toContain('aria-disabled="true"');
    // 첫 렌더의 값(2명)이 설정 인원(5명)보다 적어도 완료할 수 있어야 한다.
    expect(markup).not.toContain('disabled=""');
    expect(markup).toContain("2명부터 20명까지 고를 수 있어요");
  });

  it("blocks only the counts below the number of people who joined", () => {
    const markup = renderWithJoined(4);
    expect(markup).toMatch(/aria-disabled="true"[^>]*>2명</);
    expect(markup).toMatch(/aria-disabled="true"[^>]*>3명</);
    expect(markup).not.toMatch(/aria-disabled="true"[^>]*>4명</);
    expect(markup).toContain("지금 참여한 4명부터 20명까지 고를 수 있어요");
  });
});
