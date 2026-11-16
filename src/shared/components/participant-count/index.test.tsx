import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ParticipantCount } from "@/shared/components/participant-count";

describe("ParticipantCount", () => {
  it("누를 수 없으면 버튼이 아니라 글자로 그리고 화살표를 붙이지 않는다", () => {
    const markup = renderToStaticMarkup(
      <ParticipantCount count={0} total={10} />,
    );

    expect(markup).toContain("참여자");
    expect(markup).toContain('<span class="text-fg-brand-default">0</span>');
    expect(markup).toContain("/10");
    expect(markup).not.toContain("<button");
    // 사람 아이콘 하나만 있다.
    expect(markup.match(/<svg/g)).toHaveLength(1);
  });

  it("누를 수 있으면 버튼으로 그리고 끝에 화살표를 붙인다", () => {
    const markup = renderToStaticMarkup(
      <ParticipantCount count={3} total={4} onClick={() => undefined} />,
    );

    expect(markup).toContain('<button type="button"');
    expect(markup).toContain('<span class="text-fg-brand-default">3</span>');
    // 사람 아이콘과 화살표 아이콘
    expect(markup.match(/<svg/g)).toHaveLength(2);
  });
});
