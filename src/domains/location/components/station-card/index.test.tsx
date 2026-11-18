import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StationCard } from ".";

/** 태그를 지우고 화면 읽기 기능이 이어 읽는 글자만 남긴다. */
function textOf(markup: string) {
  return markup.replace(/<[^>]+>/g, "");
}

describe("StationCard", () => {
  it("순위, 역 이름, 평균 시간을 버튼 하나에 담는다", () => {
    const markup = renderToStaticMarkup(
      <StationCard rank={2} name="충무로역" durationMinutes={28} />,
    );

    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(markup).toContain('type="button"');
    expect(textOf(markup)).toBe("2위충무로역평균28분");
  });

  it("1시간이 넘으면 시간과 분을 나눠 보여 준다", () => {
    const markup = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" durationMinutes={70} />,
    );

    expect(textOf(markup)).toBe("1위서울역평균1시간10분");
  });

  it("분이 0으로 떨어지면 시간만 보여 준다", () => {
    const markup = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" durationMinutes={60} />,
    );

    expect(textOf(markup)).toBe("1위서울역평균1시간");
  });

  it("고른 상태를 aria-pressed로 알린다", () => {
    const selected = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" durationMinutes={27} selected />,
    );
    const unselected = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" durationMinutes={27} />,
    );

    expect(selected).toContain('aria-pressed="true"');
    expect(unselected).toContain('aria-pressed="false"');
  });

  it("고른 카드에는 누름 색을 두지 않는다", () => {
    const selected = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" durationMinutes={27} selected />,
    );
    const unselected = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" durationMinutes={27} />,
    );

    expect(selected).not.toContain("active:");
    expect(unselected).toContain("active:bg-fill-neutral-subtler");
  });
});
