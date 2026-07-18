import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";

vi.mock("@/assets/icons/share.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <svg aria-hidden="true" className={className} />
  ),
}));

describe("BottomActionBarWithButtonAndShare", () => {
  it("renders share as a primary icon CTA before the secondary action", () => {
    const markup = renderToStaticMarkup(
      <BottomActionBarWithButtonAndShare
        onClick={() => undefined}
        onShare={() => undefined}
      >
        일정 추가하기
      </BottomActionBarWithButtonAndShare>,
    );

    expect(markup).toContain('aria-label="공유하기"');
    expect(markup.indexOf('aria-label="공유하기"')).toBeLessThan(
      markup.indexOf("일정 추가하기"),
    );
    expect(markup).not.toContain("<span>공유하기</span>");
    expect(markup).toContain("size-[54px]");
    expect(markup).toContain("bg-primary-main");
    expect(markup).toContain("border-k-200");
  });
});
