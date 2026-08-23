import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeExitConfirmModal } from "@/domains/meeting/components/home-exit-confirm-modal";

function render(isOpen: boolean) {
  return renderToStaticMarkup(
    <HomeExitConfirmModal
      isOpen={isOpen}
      onCancel={() => undefined}
      onConfirm={() => undefined}
    />,
  );
}

describe("HomeExitConfirmModal", () => {
  it("닫혀 있으면 아무것도 그리지 않는다", () => {
    expect(render(false)).toBe("");
  });

  it("돌아올 수 없는 이유와 대처법을 함께 알려준다", () => {
    const markup = render(true);

    expect(markup).toContain("홈으로 나갈까요?");
    expect(markup).toContain("최근 모임 목록에 남지 않아요");
    expect(markup).toContain("링크를 따로 보관해주세요");
  });

  it("실수로 나가지 않도록 취소를 먼저 배치한다", () => {
    const markup = render(true);

    expect(markup.indexOf("취소")).toBeLessThan(markup.indexOf("홈으로 가기"));
  });
});
