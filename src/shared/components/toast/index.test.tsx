import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "@/shared/components/toast";

vi.mock("sonner", () => ({
  Toaster: ({
    toastOptions,
  }: {
    toastOptions?: {
      classNames?: {
        title?: string;
        toast?: string;
      };
    };
  }) => (
    <div className={toastOptions?.classNames?.toast}>
      <span className={toastOptions?.classNames?.title}>긴 토스트 메시지</span>
    </div>
  ),
  toast: {
    dismiss: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("Toast", () => {
  it("allows long messages to wrap within the mobile viewport", () => {
    const markup = renderToStaticMarkup(<Toast />);

    expect(markup).toContain("whitespace-normal");
    expect(markup).toContain("break-keep");
    expect(markup).toContain("min-w-[min(320px,calc(100vw-40px))]");
    expect(markup).toContain("max-w-[calc(100vw-40px)]");
    expect(markup).toContain("text-left");
    expect(markup).not.toContain("whitespace-nowrap");
    expect(markup).not.toContain("text-center");
  });
});
