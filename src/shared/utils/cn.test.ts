import { describe, expect, it } from "vitest";
import { cn } from "@/shared/utils/cn";

describe("cn", () => {
  it("keeps only the last design system text style", () => {
    expect(cn("textStyle_body4", "textStyle_title3")).toBe("textStyle_title3");
  });

  it("keeps line height and weight overrides written after a text style", () => {
    expect(cn("textStyle_body3", "leading-none")).toBe(
      "textStyle_body3 leading-none",
    );
    expect(cn("textStyle_body4", "font-semibold")).toBe(
      "textStyle_body4 font-semibold",
    );
  });

  it("lets a text style replace earlier size and line height utilities", () => {
    expect(cn("text-sm leading-none", "textStyle_body4")).toBe(
      "textStyle_body4",
    );
  });

  it("does not treat a text style as a text color", () => {
    expect(cn("textStyle_body4", "text-k-500")).toBe(
      "textStyle_body4 text-k-500",
    );
  });
});
