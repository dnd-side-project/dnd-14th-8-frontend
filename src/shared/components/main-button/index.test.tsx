import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MainButton } from "@/shared/components/main-button";

describe("MainButton", () => {
  it("adds the requested character motion class to the character wrapper", () => {
    const markup = renderToStaticMarkup(
      <MainButton
        title="일정 조율하기"
        character={<svg aria-hidden="true" />}
        characterMotion="float"
      />,
    );

    expect(markup).toContain("animate-main-character-float");
  });
});
