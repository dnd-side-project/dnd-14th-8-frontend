import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MainButton } from "@/shared/components/main-button";

describe("MainButton", () => {
  it("renders the graphic as a decorative image behind the text", () => {
    const markup = renderToStaticMarkup(
      <MainButton
        title="일정 조율하기"
        description="모두가 가능한 시간 찾기"
        graphicSrc="/main-schedule.svg"
      />,
    );

    expect(markup).toContain('src="/main-schedule.svg"');
    expect(markup).toContain('alt=""');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain("일정 조율하기");
  });
});
