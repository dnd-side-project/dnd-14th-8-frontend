import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { GetMeetingScheduleVoteResultResponse } from "@/domains/meeting/types/meeting-api-types";
import { ScheduleMainOptimalContent } from "@/domains/schedule/components/schedule-main-optimal-content";

const { mockUseResults } = vi.hoisted(() => ({
  mockUseResults: vi.fn(),
}));

vi.mock("react-router", () => ({
  useParams: () => ({ meetingId: "meeting-1" }),
}));

vi.mock(
  "@/domains/schedule/hooks/use-get-meeting-schedule-vote-results",
  () => ({
    useGetMeetingScheduleVoteResults: mockUseResults,
  }),
);

function renderWith(data: GetMeetingScheduleVoteResultResponse) {
  mockUseResults.mockReturnValue({ data, isPending: false });
  return renderToStaticMarkup(<ScheduleMainOptimalContent />);
}

describe("ScheduleMainOptimalContent", () => {
  // 서버는 Asia/Seoul 벽시계 시각을 내려준다.
  // 화면에서 시간을 다시 보정하면 카드의 시각이 날짜/요일과 어긋난다.
  it("서버가 내려준 시각을 보정 없이 그대로 보여준다", () => {
    const markup = renderWith({
      participantCount: 3,
      resultCount: 1,
      scheduleVoteResult: [
        {
          scheduleDate: "2026-02-10",
          scheduleDayOfWeek: "화",
          startTime: "18:00",
          endTime: "21:00",
          voteCount: 3,
          availableParticipantNames: ["가", "나", "다"],
          unavailableParticipantNames: [],
        },
      ],
    });

    expect(markup).toContain("18:00 ~ 21:00");
  });

  it("자정까지 이어지는 범위도 날짜를 넘기지 않고 보여준다", () => {
    const markup = renderWith({
      participantCount: 2,
      resultCount: 1,
      scheduleVoteResult: [
        {
          scheduleDate: "2026-02-10",
          scheduleDayOfWeek: "화",
          startTime: "22:00",
          endTime: "24:00",
          voteCount: 2,
          availableParticipantNames: ["가", "나"],
          unavailableParticipantNames: [],
        },
      ],
    });

    expect(markup).toContain("22:00 ~ 24:00");
    expect(markup).toContain("2월 10일 화");
  });
});
