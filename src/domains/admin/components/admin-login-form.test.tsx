import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminLoginForm } from "@/domains/admin/components/admin-login-form";

describe("AdminLoginForm", () => {
  it("renders a password token field", () => {
    const markup = renderToStaticMarkup(<AdminLoginForm onSubmit={() => {}} />);

    expect(markup).toContain("관리자 대시보드");
    expect(markup).toContain('type="password"');
    expect(markup).toContain("X-Admin-Token");
  });

  it("shows an error message with an alert role", () => {
    const markup = renderToStaticMarkup(
      <AdminLoginForm onSubmit={() => {}} error="토큰이 올바르지 않습니다." />,
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("토큰이 올바르지 않습니다.");
  });
});
