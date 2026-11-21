import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NearbyPlaceCard } from ".";

/** 태그를 지우고 화면 읽기 기능이 이어 읽는 글자만 남긴다. */
function textOf(markup: string) {
  return markup.replace(/<[^>]+>/g, "");
}

describe("NearbyPlaceCard", () => {
  it("이름, 주소, 역에서의 거리 순서로 버튼 하나에 담는다", () => {
    const markup = renderToStaticMarkup(
      <NearbyPlaceCard
        name="모여 스터디룸"
        address="서울 중구 을지로 100"
        stationName="을지로3가역"
        distanceMeters={120}
      />,
    );

    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(markup).toContain('type="button"');
    expect(textOf(markup)).toBe(
      "모여 스터디룸서울 중구 을지로 100을지로3가역에서 120m",
    );
  });

  it("거리는 km로 바꾸지 않고 받은 m 그대로 보여 준다", () => {
    const markup = renderToStaticMarkup(
      <NearbyPlaceCard
        name="충무 미팅룸"
        address="서울 중구 충무로 12"
        stationName="충무로역"
        distanceMeters={1000}
      />,
    );

    expect(textOf(markup)).toContain("충무로역에서 1000m");
  });

  it("영업 상태는 보여 주지 않는다", () => {
    const text = textOf(
      renderToStaticMarkup(
        <NearbyPlaceCard
          name="카페 마루"
          address="서울 중구 을지로 120"
          stationName="을지로3가역"
          distanceMeters={40}
        />,
      ),
    );

    expect(text).not.toContain("영업");
  });
});
