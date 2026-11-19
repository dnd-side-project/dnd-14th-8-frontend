import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SubwayLineBadge } from ".";

describe("SubwayLineBadge", () => {
  it("노선 색 바탕에 노선 이름을 쓴다", () => {
    const markup = renderToStaticMarkup(<SubwayLineBadge line="1호선" />);

    expect(markup).toContain("background-color:#004A85");
    expect(markup).toContain("text-fg-neutral-faintest");
    expect(markup).toContain(">1호선</span>");
  });

  it("밝은 노선 색에는 진한 글자를 쓴다", () => {
    const markup = renderToStaticMarkup(<SubwayLineBadge line="경의중앙선" />);

    expect(markup).toContain("background-color:#6AC2B3");
    expect(markup).toContain("text-fg-neutral-stronger");
  });

  it("색 표에 없는 노선은 회색 바탕에 이름만 보여 준다", () => {
    const markup = renderToStaticMarkup(<SubwayLineBadge line="위례선" />);

    expect(markup).not.toContain("style=");
    expect(markup).toContain("bg-fill-neutral-subtler");
    expect(markup).toContain(">위례선</span>");
  });
});
