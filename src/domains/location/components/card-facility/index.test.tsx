import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CardFacility } from ".";

/** 태그를 지우고 화면 읽기 기능이 이어 읽는 글자만 남긴다. */
function textOf(markup: string) {
  return markup.replace(/<[^>]+>/g, "");
}

describe("CardFacility", () => {
  it("장소 이름과 역에서 거리를 보여 준다", () => {
    const markup = renderToStaticMarkup(
      <CardFacility
        name="모여 스터디룸"
        stationName="을지로3가"
        distanceMeters={120}
      />,
    );

    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(textOf(markup)).toBe("모여 스터디룸을지로3가역에서 120m");
  });

  it('이미 "역"으로 끝나는 역 이름에는 "역"을 더 붙이지 않는다', () => {
    const markup = renderToStaticMarkup(
      <CardFacility
        name="카페 마루"
        stationName="서울역"
        distanceMeters={40}
      />,
    );

    expect(textOf(markup)).toBe("카페 마루서울역에서 40m");
  });

  it("카카오 결과에는 영업 정보가 없어 영업 상태를 보여 주지 않는다", () => {
    const markup = renderToStaticMarkup(
      <CardFacility
        name="모여 스터디룸"
        stationName="을지로3가"
        distanceMeters={120}
      />,
    );

    expect(markup).not.toContain("영업");
    expect(markup).not.toContain("추천장소");
  });
});
