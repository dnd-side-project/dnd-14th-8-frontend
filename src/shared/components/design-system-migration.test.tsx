import { Header } from "@moyeorak/design-system";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ItemSavedplace } from "@/domains/location/components/item-savedplace";
import { StationBadges } from "@/domains/location/components/station-badges";
import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { Calendar } from "@/shared/components/calendar";

describe("design system migration contracts", () => {
  it("keeps ordinary actions out of native form submission", () => {
    const markup = renderToStaticMarkup(
      <form>
        <ButtonBottom>저장</ButtonBottom>
      </form>,
    );
    expect(markup).toContain('type="button"');
    expect(markup).not.toContain('type="submit"');
  });
  it("preserves explicit submission, disabled and busy state", () => {
    const markup = renderToStaticMarkup(
      <ButtonBottom type="submit" disabled aria-busy="true">
        저장 중
      </ButtonBottom>,
    );
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="true"');
  });
  it("keeps edit actions distinct from selection controls", () => {
    const markup = renderToStaticMarkup(
      <ItemSavedplace
        name="민지"
        location="강남역"
        address="서울 강남구"
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    // 수정, 삭제는 선택 상태가 없는 액션이라 Toggle(aria-pressed)을 쓰지 않는다.
    expect(markup).not.toContain("aria-pressed");
    expect(markup.match(/<button[^>]*type="button"/g)).toHaveLength(2);
    // 참여자 이름은 클릭이 없는 Badge다.
    expect(markup).toMatch(/<span[^>]*>민지<\/span>/);
  });
  it("exposes the parent-controlled selected state of station chips", () => {
    const station = (stationId: number, stationName: string) =>
      ({ stationId, stationName }) as StationRecommendationDto;
    const markup = renderToStaticMarkup(
      <StationBadges
        recommendations={[station(1, "서울역"), station(2, "강남역")]}
        selectedStationId={1}
        onBack={() => {}}
      />,
    );
    expect(markup).toMatch(/aria-pressed="true"[^>]*>서울역</);
    expect(markup).toMatch(/aria-pressed="false"[^>]*>강남역</);
  });
  it("names the calendar navigation icon buttons", () => {
    const markup = renderToStaticMarkup(<Calendar />);
    expect(markup).toMatch(/<button[^>]*aria-label="이전 달"/);
    expect(markup).toMatch(/<button[^>]*aria-label="다음 달"/);
  });
  it("renders the page title as h1 with back and reset actions outside form submission", () => {
    const markup = renderToStaticMarkup(
      <form>
        <Header
          title="일정 추가"
          onBack={() => undefined}
          actionLabel="초기화"
          onAction={() => undefined}
        />
      </form>,
    );
    expect(markup).toMatch(/<h1[^>]*>일정 추가<\/h1>/);
    expect(markup).toContain('aria-label="뒤로가기"');
    expect(markup).toContain(">초기화</button>");
    expect(markup.match(/type="button"/g)).toHaveLength(2);
    expect(markup).not.toContain('type="submit"');
  });
  it("renders only the title when no back or action handler is given", () => {
    const markup = renderToStaticMarkup(<Header title="모임 생성" />);
    expect(markup).toMatch(/<h1[^>]*>모임 생성<\/h1>/);
    expect(markup).not.toContain("<button");
  });
});
