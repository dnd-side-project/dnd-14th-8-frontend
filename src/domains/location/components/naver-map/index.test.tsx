import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NaverMap } from "@/domains/location/components/naver-map";

describe("NaverMap", () => {
  it("keeps the map SDK layers in their own stacking context", () => {
    // SDK가 컨트롤·마커 레이어에 z-index 100대를 심는다. 컨테이너가
    // 스택 컨텍스트를 만들지 않으면 그 값이 바텀시트(z-20)와
    // 하단 액션바(z-30)를 뚫고 올라온다.
    const markup = renderToStaticMarkup(<NaverMap />);

    expect(markup).toContain("isolate");
  });

  it("흐리게 하면 지도 요소에 블러와 확대를 주고 조작을 막는다", () => {
    const markup = renderToStaticMarkup(<NaverMap blurred />);

    expect(markup).toContain("blur-[8px]");
    expect(markup).toContain("scale-[1.08]");
    // SDK가 지도 요소에 tabindex를 넣으므로 inert로 포커스와 조작을 함께 막는다.
    expect(markup).toContain("inert");
  });

  it("기본으로는 흐리게 하지 않는다", () => {
    const markup = renderToStaticMarkup(<NaverMap />);

    expect(markup).not.toContain("blur-[8px]");
    expect(markup).not.toContain("inert");
  });
});
