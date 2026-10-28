import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { NearbyPlacesFloatingButton } from "@/domains/location/components/nearby-places-floating-button";

vi.mock("@/assets/icons/search.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <svg aria-hidden="true" className={className} />
  ),
}));

describe("NearbyPlacesFloatingButton", () => {
  it("renders as a compact secondary map action with an accessible label", () => {
    const markup = renderToStaticMarkup(
      <NearbyPlacesFloatingButton onClick={() => undefined} />,
    );

    expect(markup).toContain('aria-label="선택한 역 주변 장소 둘러보기"');
    expect(markup).toContain("주변 장소");
    expect(markup).toContain("h-10");
    expect(markup).toContain("rounded-full");
  });
});
