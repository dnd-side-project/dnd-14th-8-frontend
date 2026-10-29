import { Header } from "@moyeorak/design-system";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChipButtonWithIcon } from "@/domains/location/components/chip-button-with-icon";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { ChipButton } from "@/shared/components/chip-button";
import { IconButton } from "@/shared/components/icon-button";

function TestIcon() {
  return <svg aria-hidden="true" />;
}

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
      <ChipButton variant="primary" aria-controls="editor" aria-expanded>
        수정
      </ChipButton>,
    );
    expect(markup).not.toContain("aria-pressed");
    expect(markup).toContain('aria-controls="editor"');
    expect(markup).toContain('aria-expanded="true"');
  });
  it("exposes the parent-controlled selected state of station chips", () => {
    const selected = renderToStaticMarkup(
      <ChipButton variant="midpointSelected">서울역</ChipButton>,
    );
    const unselected = renderToStaticMarkup(
      <ChipButton variant="midpoint">강남역</ChipButton>,
    );
    expect(selected).toContain('aria-pressed="true"');
    expect(unselected).toContain('aria-pressed="false"');
  });
  it("preserves the category filter label and controlled state", () => {
    const markup = renderToStaticMarkup(
      <ChipButtonWithIcon icon={<TestIcon />} status="selected" disabled>
        카페
      </ChipButtonWithIcon>,
    );
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain("카페");
    expect(markup.match(/<button/g)).toHaveLength(1);
  });
  it("preserves the accessible name and disabled state of icon actions", () => {
    const markup = renderToStaticMarkup(
      <IconButton
        aria-label="입력 지우기"
        icon={TestIcon}
        size="xl"
        iconSize="sm"
        disabled
      />,
    );
    expect(markup).toContain('aria-label="입력 지우기"');
    expect(markup).toContain('disabled=""');
    expect(markup.match(/<button/g)).toHaveLength(1);
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
    const markup = renderToStaticMarkup(<Header title="모임정보 입력" />);
    expect(markup).toMatch(/<h1[^>]*>모임정보 입력<\/h1>/);
    expect(markup).not.toContain("<button");
  });
});
