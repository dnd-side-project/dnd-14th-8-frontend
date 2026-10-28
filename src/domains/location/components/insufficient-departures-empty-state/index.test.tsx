import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InsufficientDeparturesEmptyState } from "@/domains/location/components/insufficient-departures-empty-state";
import type { InsufficientDepartureContent } from "@/domains/location/utils/insufficient-departures";

function render(content: InsufficientDepartureContent) {
  return renderToStaticMarkup(
    <InsufficientDeparturesEmptyState
      content={content}
      onAddDeparture={() => undefined}
      onShare={() => undefined}
    />,
  );
}

describe("InsufficientDeparturesEmptyState", () => {
  it("등록된 출발지를 이름과 장소가 있는 슬롯으로 보여준다", () => {
    const markup = render({
      title: "한 명만 더 등록하면 중간지점을 찾을 수 있어요",
      slots: [
        {
          key: "departure-11",
          kind: "filled",
          name: "지훈",
          location: "강남역 2번 출구",
          isMine: true,
        },
        { key: "empty-0", kind: "invite" },
      ],
      primaryAction: "share",
      secondaryAction: "add",
    });

    expect(markup).toContain("한 명만 더 등록하면 중간지점을 찾을 수 있어요");
    expect(markup).toContain("지훈");
    expect(markup).toContain("강남역 2번 출구");
    expect(markup).toContain("나");
    expect(markup).toContain('aria-label="출발지 부족 안내 캐릭터"');
  });

  it("진행 상태를 설명하는 문장을 반복하지 않는다", () => {
    const markup = render({
      title: "2명이 모이면 중간지점을 찾아드려요",
      slots: [
        { key: "empty-0", kind: "add-mine" },
        { key: "empty-1", kind: "waiting" },
      ],
      primaryAction: "add",
      secondaryAction: "share",
    });

    expect(markup).not.toContain("출발지 등록 0 / 2");
    expect(markup).not.toContain("중간지점 추천까지");
  });

  it("빈 자리 중 첫 칸만 누를 수 있게 둔다", () => {
    const markup = render({
      title: "2명이 모이면 중간지점을 찾아드려요",
      slots: [
        { key: "empty-0", kind: "add-mine" },
        { key: "empty-1", kind: "waiting" },
      ],
      primaryAction: "add",
      secondaryAction: "share",
    });

    expect(markup).toContain("내 출발지 등록하기");
    expect(markup).toContain("친구를 기다리는 중");
    // 내 등록 슬롯과 보조 링크만 버튼이다. 대기 슬롯은 누를 수 없다.
    expect(markup.match(/<button/g)).toHaveLength(2);
  });

  it("내 출발지를 이미 등록했으면 남은 자리가 공유 버튼이 된다", () => {
    const markup = render({
      title: "한 명만 더 등록하면 중간지점을 찾을 수 있어요",
      slots: [
        {
          key: "departure-11",
          kind: "filled",
          name: "지훈",
          location: "강남역 2번 출구",
          isMine: true,
        },
        { key: "empty-0", kind: "invite" },
      ],
      primaryAction: "share",
      secondaryAction: "add",
    });

    expect(markup).toContain("초대 링크 공유하기");
    expect(markup).toContain("출발지 직접 추가하기");
  });
});
