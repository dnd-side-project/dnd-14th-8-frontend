import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DotPin } from ".";

describe("DotPin", () => {
  it("이름은 화면에 그리지 않고 화면 낭독기용 글자로만 남긴다", () => {
    const markup = renderToStaticMarkup(<DotPin text="락이" variant="black" />);

    expect(markup).toContain('<span class="sr-only">락이</span>');
    expect(markup.match(/락이/g)).toHaveLength(1);
  });

  it("지름 14px의 흰 테두리 원으로 그린다", () => {
    const markup = renderToStaticMarkup(<DotPin text="락이" variant="black" />);

    expect(markup).toContain("size-3.5");
    expect(markup).toContain("rounded-full");
    expect(markup).toContain("border-2 border-fill-neutral-faintest");
  });

  it("다른 사람 출발지는 검은 점이다", () => {
    const markup = renderToStaticMarkup(<DotPin text="락이" variant="black" />);

    expect(markup).toContain("bg-fill-neutral-default");
    expect(markup).not.toContain("bg-fill-brand-default");
  });

  it("내 출발지는 파란 점이다", () => {
    const markup = renderToStaticMarkup(<DotPin text="락이" variant="blue" />);

    expect(markup).toContain("bg-fill-brand-default");
    expect(markup).not.toContain("bg-fill-neutral-default");
  });
});
