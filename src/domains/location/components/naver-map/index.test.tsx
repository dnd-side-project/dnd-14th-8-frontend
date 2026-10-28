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
});
