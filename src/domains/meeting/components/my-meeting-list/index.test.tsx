import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MyMeetingList } from "@/domains/meeting/components/my-meeting-list";

describe("MyMeetingList", () => {
  it("renders my meetings with host, role, participant count, and created date", () => {
    const markup = renderToStaticMarkup(
      <MyMeetingList
        meetings={[
          {
            createdAt: "2026-07-23T14:10:00",
            hostName: "민수",
            isHost: true,
            meetingId: "meeting-id",
            participantCount: 4,
          },
        ]}
        onSelect={vi.fn()}
      />,
    );

    expect(markup).toContain("최근 모임");
    expect(markup).toContain("민수님의 모임");
    expect(markup).toContain("팀장 · 4명 · 7월 23일 생성");
  });

  it("renders nothing when there are no meetings", () => {
    const markup = renderToStaticMarkup(
      <MyMeetingList meetings={[]} onSelect={vi.fn()} />,
    );

    expect(markup).toBe("");
  });

  it("renders up to five recent meetings", () => {
    const meetings = Array.from({ length: 6 }, (_, index) => ({
      createdAt: `2026-07-${23 - index}T14:10:00`,
      hostName: `호스트${index + 1}`,
      isHost: index === 0,
      meetingId: `meeting-id-${index + 1}`,
      participantCount: 4,
    }));

    const markup = renderToStaticMarkup(
      <MyMeetingList meetings={meetings} onSelect={vi.fn()} />,
    );

    expect(markup).toContain("호스트1님의 모임");
    expect(markup).toContain("호스트5님의 모임");
    expect(markup).not.toContain("호스트6님의 모임");
  });
});
