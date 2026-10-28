import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/domains/meeting/pages";

function renderLandingPage() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe("LandingPage", () => {
  it("renders the two main entry cards", () => {
    const markup = renderLandingPage();

    expect(markup).toContain("모임을 더 즐겁게, 효율적으로");
    expect(markup).toContain("일정 조율하기");
    expect(markup).toContain("모두가 가능한 시간 찾기");
    expect(markup).toContain("중간 장소 찾기");
    expect(markup).toContain("모두가 효율적인 장소 찾기");
  });

  it("does not render elements removed in the redesign", () => {
    const markup = renderLandingPage();

    expect(markup).not.toContain("최근 모임");
    expect(markup).not.toContain("이용방법 보기");
    expect(markup).not.toContain("moyeorak.team@gmail.com");
  });
});
