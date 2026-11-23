import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FacilityPinDefault, FacilityPinDot } from ".";

describe("FacilityPinDot", () => {
  it("14px 둥근 사각형을 흰 테두리 2px와 브랜드 파랑으로 그린다", () => {
    const markup = renderToStaticMarkup(<FacilityPinDot />);

    expect(markup).toContain("size-3.5");
    expect(markup).toContain("rounded-sm");
    expect(markup).toContain("border-2 border-fill-neutral-faintest");
    expect(markup).toContain("bg-fill-brand-default");
  });

  it("사람 출발지의 원 점과 구분되게 원으로 그리지 않는다", () => {
    const markup = renderToStaticMarkup(<FacilityPinDot />);

    expect(markup).not.toContain("rounded-full");
  });

  it("장소 핀과 같은 그림자를 쓴다", () => {
    const shadow = "shadow-[0_0_4px_0_rgba(0,0,0,0.25)]";

    expect(renderToStaticMarkup(<FacilityPinDot />)).toContain(shadow);
    expect(renderToStaticMarkup(<FacilityPinDefault type="cafe" />)).toContain(
      shadow,
    );
  });

  it("아이콘과 이름을 넣지 않는다", () => {
    const markup = renderToStaticMarkup(<FacilityPinDot />);

    expect(markup).not.toContain("<svg");
    expect(markup).toMatch(/^<div class="[^"]*"><\/div>$/);
  });

  it("넘긴 클래스를 더한다", () => {
    const markup = renderToStaticMarkup(
      <FacilityPinDot className="opacity-40" />,
    );

    expect(markup).toContain("opacity-40");
    expect(markup).toContain("size-3.5");
  });
});
