import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ItemSavedplace } from ".";

describe("ItemSavedplace", () => {
  it("주소가 있으면 장소 이름 아래 둘째 줄로 보여 준다", () => {
    const markup = renderToStaticMarkup(
      <ItemSavedplace
        name="락이"
        location="서대문역 5호선"
        address="서울 종로구 통일로 지하 126"
      />,
    );

    expect(markup).toContain("서대문역 5호선");
    expect(markup).toContain("서울 종로구 통일로 지하 126");
  });

  it("주소가 없으면 둘째 줄을 그리지 않는다", () => {
    const markup = renderToStaticMarkup(
      <ItemSavedplace
        name="민지"
        location="서울 강남구 강남대로 지하 396"
        address=""
      />,
    );

    expect(markup).not.toContain("<p");
  });
});
