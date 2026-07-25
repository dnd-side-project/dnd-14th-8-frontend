import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RecentMeetingFlowDialog } from "@/domains/meeting/components/recent-meeting-flow-dialog";

describe("RecentMeetingFlowDialog", () => {
  it("renders schedule and location actions for a selected recent meeting", () => {
    const markup = renderToStaticMarkup(
      <RecentMeetingFlowDialog
        hostName="민수"
        isOpen
        onClose={vi.fn()}
        onGoToLocation={vi.fn()}
        onGoToSchedule={vi.fn()}
      />,
    );

    expect(markup).toContain("어디로 이동할까요?");
    expect(markup).toContain("민수님의 모임에서 확인할 화면을 선택해주세요.");
    expect(markup).toContain("일정 조율 보기");
    expect(markup).toContain("중간지점 보기");
  });

  it("renders nothing when closed", () => {
    const markup = renderToStaticMarkup(
      <RecentMeetingFlowDialog
        hostName="민수"
        isOpen={false}
        onClose={vi.fn()}
        onGoToLocation={vi.fn()}
        onGoToSchedule={vi.fn()}
      />,
    );

    expect(markup).toBe("");
  });
});
