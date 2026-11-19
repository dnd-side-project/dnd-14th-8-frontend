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

  it("노선이 있으면 순위, 역 이름, 노선, 평균 시간 순서로 읽는다", () => {
    const markup = renderToStaticMarkup(
      <StationCard
        rank={1}
        name="을지로3가역"
        lines={["2호선", "3호선"]}
        durationMinutes={27}
      />,
    );

    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(textOf(markup)).toBe("1위을지로3가역2호선3호선평균27분");
  });

  it("노선은 받은 순서대로 모두 보여 준다", () => {
    const markup = renderToStaticMarkup(
      <StationCard
        rank={3}
        name="서울역"
        lines={["1호선", "4호선", "경의중앙선", "공항철도", "GTX-A"]}
        durationMinutes={32}
      />,
    );

    expect(textOf(markup)).toBe(
      "3위서울역1호선4호선경의중앙선공항철도GTX-A평균32분",
    );
  });

  it("노선이 없으면 배지 줄을 그리지 않는다", () => {
    const markup = renderToStaticMarkup(
      <StationCard rank={1} name="서울역" lines={[]} durationMinutes={27} />,
    );

    expect(markup).not.toContain("flex-wrap");
    expect(textOf(markup)).toBe("1위서울역평균27분");
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
