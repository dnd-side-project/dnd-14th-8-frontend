import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeLogoButton } from "@/shared/components/home-logo-button";

vi.mock("@/assets/moyeorak-logo.svg?react", () => ({
  default: ({ height, width }: { height?: number; width?: number }) => (
    <svg data-testid="moyeorak-logo" height={height} width={width} />
  ),
}));

describe("HomeLogoButton", () => {
  it("스크린리더가 목적지를 알 수 있게 홈으로 간다고 알린다", () => {
    const markup = renderToStaticMarkup(
      <HomeLogoButton onClick={() => undefined} />,
    );

    expect(markup).toContain('aria-label="모여락 홈으로"');
  });

  it("폼 안에 놓여도 제출되지 않도록 type=button으로 렌더한다", () => {
    const markup = renderToStaticMarkup(
      <HomeLogoButton onClick={() => undefined} />,
    );

    expect(markup).toContain('type="button"');
  });

  it("평면 로고와 구분되도록 눌리는 pill 형태로 보인다", () => {
    const markup = renderToStaticMarkup(
      <HomeLogoButton onClick={() => undefined} />,
    );

    expect(markup).toContain("rounded-full");
    expect(markup).toContain("bg-k-5");
    expect(markup).toContain("shadow-");
  });

  it("워드마크가 눌려 보이지 않도록 238:62 비율을 유지한 크기로 렌더한다", () => {
    const markup = renderToStaticMarkup(
      <HomeLogoButton onClick={() => undefined} />,
    );

    expect(markup).toContain('height="20"');
    expect(markup).toContain('width="77"');
  });

  it("화면마다 위치를 잡을 수 있도록 className을 넘겨받는다", () => {
    const markup = renderToStaticMarkup(
      <HomeLogoButton
        className="absolute top-4 left-4"
        onClick={() => undefined}
      />,
    );

    expect(markup).toContain("absolute top-4 left-4");
  });
});
