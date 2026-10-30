import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NearbyDeparturesNote } from ".";

describe("NearbyDeparturesNote", () => {
  it("renders as quiet helper text without a large headline", () => {
    const markup = renderToStaticMarkup(<NearbyDeparturesNote />);

    expect(markup).toContain("가까운 출발지예요");
    expect(markup).toContain("후보역 이동 시간이 비슷해요");
    expect(markup).toContain("textStyle_body4");
    expect(markup).toContain("text-fg-neutral-subtle");
    expect(markup).not.toContain("가까운 후보예요");
    expect(markup).not.toContain("textStyle_head1");
    expect(markup).not.toContain("bg-fill-brand-subtle");
  });
});
