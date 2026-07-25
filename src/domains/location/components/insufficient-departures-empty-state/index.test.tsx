import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InsufficientDeparturesEmptyState } from "@/domains/location/components/insufficient-departures-empty-state";

describe("InsufficientDeparturesEmptyState", () => {
  it("renders the location shortage state with a character graphic", () => {
    const markup = renderToStaticMarkup(
      <InsufficientDeparturesEmptyState
        content={{
          title: "내 출발지를 추가하면 중간지점을 찾을 수 있어요",
          description: null,
          progressText: "출발지 등록 1 / 5",
          remainingText: "중간지점 추천까지 1명 더 필요해요",
          helperText: null,
          totalStatusText: null,
          primaryAction: "add",
          secondaryAction: "share",
        }}
        onAddDeparture={() => undefined}
        onShare={() => undefined}
      />,
    );

    expect(markup).toContain("내 출발지를 추가하면 중간지점을 찾을 수 있어요");
    expect(markup).toContain("출발지 등록 1 / 5");
    expect(markup).toContain("중간지점 추천까지 1명 더 필요해요");
    expect(markup).not.toContain("전체 5명 중 1명이 등록했어요");
    expect(markup).not.toContain("내 출발지만 추가하면 결과를 볼 수 있어요");
    expect(markup).not.toContain("결과가 자동으로 표시돼요");
    expect(markup).toContain('aria-label="출발지 부족 안내 캐릭터"');
  });
});
