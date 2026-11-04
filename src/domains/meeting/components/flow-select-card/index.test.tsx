import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FlowSelectCard } from "@/domains/meeting/components/flow-select-card";

function renderCard() {
  return renderToStaticMarkup(
    <FlowSelectCard
      title="일정 조율하기"
      description="모두가 가능한 시간 찾기"
      graphicSrc="/main-schedule.svg"
    />,
  );
}

describe("FlowSelectCard", () => {
  it("renders the graphic as a decorative image behind the text", () => {
    const markup = renderCard();

    expect(markup).toContain('src="/main-schedule.svg"');
    expect(markup).toContain('alt=""');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain("일정 조율하기");
  });

  it("names the button with the title and describes it with the description", () => {
    const markup = renderCard();
    const labelledBy = markup.match(/aria-labelledby="([^"]+)"/)?.[1];
    const describedBy = markup.match(/aria-describedby="([^"]+)"/)?.[1];

    expect(markup).toContain(`id="${labelledBy}"`);
    expect(markup).toMatch(
      new RegExp(`id="${labelledBy}"[^>]*>일정 조율하기<`),
    );
    expect(markup).toMatch(
      new RegExp(`id="${describedBy}"[^>]*>모두가 가능한 시간 찾기<`),
    );
  });

  it("uses no heading or paragraph inside the button", () => {
    const markup = renderCard();

    expect(markup).not.toMatch(/<h[1-6]/);
    expect(markup).not.toContain("<p");
  });
});
