import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  ScheduleMainSummary,
  ScheduleMainSummaryContent,
  type ScheduleMainSummaryContentProps,
} from "@/domains/schedule/components/schedule-main-summary";

vi.mock("@/domains/schedule/hooks/use-get-meeting-schedules", () => ({
  useGetMeetingSchedules: () => ({
    data: {
      dateOptions: ["2026-12-24", "2026-12-25"],
      endTime: "12:00:00",
      participantCount: 8,
      startTime: "09:00:00",
      votedParticipantCount: 5,
    },
  }),
}));

vi.mock("@/domains/meeting/hooks/use-meeting-access", () => ({
  useMeetingAccess: () => ({ hostName: "김혜인", isLoading: false }),
}));

const toDates = (days: number[]) => days.map((day) => new Date(2026, 11, day));

function renderSummary(props: Partial<ScheduleMainSummaryContentProps> = {}) {
  return renderToStaticMarkup(
    <ScheduleMainSummaryContent
      canEditRange
      dates={toDates([24, 25])}
      endTime="12:00:00"
      hostName="김혜인"
      startTime="09:00:00"
      votedParticipantCount={3}
      onEditSchedule={() => undefined}
      {...props}
    />,
  );
}

describe("ScheduleMainSummaryContent", () => {
  it("호스트 이름, 일정을 등록한 인원, 날짜와 시간 범위를 표시한다", () => {
    const markup = renderSummary();

    expect(markup).toContain("김혜인님의 모임");
    expect(markup).toContain("현재 3명이 참여했어요");
    expect(markup).toContain("12.24-12.25");
    expect(markup).toContain("9:00-12:00");
  });

  it("시간표 범위를 고칠 수 있을 때만 시간표 수정 버튼을 보여준다", () => {
    expect(renderSummary({ canEditRange: true })).toContain("시간표 수정");
    expect(renderSummary({ canEditRange: false })).not.toContain("시간표 수정");
  });

  it("범위 밖 날짜가 있을 때만 개수를 붙인다", () => {
    expect(renderSummary()).not.toContain("+");
    expect(renderSummary({ dates: toDates([24, 25, 27, 29, 30]) })).toContain(
      "+3",
    );
  });

  it("진행 상태 문구를 표시하지 않는다", () => {
    const markup = renderSummary();

    expect(markup).not.toContain("일정을 등록했어요");
    expect(markup).not.toContain("링크를");
  });
});

describe("ScheduleMainSummary", () => {
  it("전체 인원이 아니라 일정을 등록한 인원을 참여 인원으로 표시한다", () => {
    const markup = renderToStaticMarkup(
      <ScheduleMainSummary
        canEditRange
        meetingId="meeting-1"
        onEditSchedule={() => undefined}
      />,
    );

    expect(markup).toContain("김혜인님의 모임");
    expect(markup).toContain("현재 5명이 참여했어요");
    expect(markup).not.toContain("현재 8명이 참여했어요");
    expect(markup).toContain("12.24-12.25");
  });
});
