import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ParticipantCountChips } from "@/domains/meeting/components/participant-count-chips";

describe("ParticipantCountChips", () => {
  it("offers 2 to 20 people as chips and marks the selected count", () => {
    const markup = renderToStaticMarkup(
      <ParticipantCountChips value={4} onChange={() => {}} />,
    );
    expect(markup.match(/<button/g)).toHaveLength(19);
    expect(markup).toMatch(/aria-pressed="true"[^>]*>4명</);
    expect(markup).toMatch(/>2명</);
    expect(markup).toMatch(/>20명</);
  });

  it("marks counts below the selectable minimum as disabled but still pressable", () => {
    const markup = renderToStaticMarkup(
      <ParticipantCountChips value={5} onChange={() => {}} selectableMin={5} />,
    );
    // 눌러서 이유를 안내할 수 있게 disabled 대신 aria-disabled를 쓴다.
    expect(markup).toMatch(/aria-disabled="true"[^>]*>4명</);
    expect(markup).not.toMatch(/aria-disabled="true"[^>]*>5명</);
    expect(markup).not.toContain('disabled=""');
  });
});
