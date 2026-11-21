import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SelectedPlaceCard } from ".";

/** 태그를 지우고 화면 읽기 기능이 이어 읽는 글자만 남긴다. */
function textOf(markup: string) {
  return markup.replace(/<[^>]+>/g, "");
}

function render() {
  return renderToStaticMarkup(
    <SelectedPlaceCard
      name="모여 스터디룸"
      address="서울 중구 을지로 100"
      stationName="을지로3가역"
      distanceMeters={120}
      onClose={() => undefined}
    />,
  );
}

describe("SelectedPlaceCard", () => {
  it("이름, 주소, 역에서의 거리를 목록 카드와 같은 순서로 보여 준다", () => {
    expect(textOf(render())).toBe(
      "모여 스터디룸서울 중구 을지로 100을지로3가역에서 120m",
    );
  });

  it("이름은 포커스를 받을 수 있는 제목이고 카드 전체는 버튼이 아니다", () => {
    const markup = render();

    expect(markup).toMatch(/<h2[^>]*tabindex="-1"[^>]*>모여 스터디룸<\/h2>/);
    // 버튼은 닫기 하나뿐이다.
    expect(markup.match(/<button/g)).toHaveLength(1);
  });

  it("닫기는 이름이 '닫기'인 아이콘 버튼이다", () => {
    const markup = render();

    expect(markup).toMatch(/<button[^>]*type="button"[^>]*aria-label="닫기"/);
  });
});
