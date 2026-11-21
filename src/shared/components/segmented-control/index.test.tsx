// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "@/shared/components/segmented-control";

const OPTIONS = [
  { value: "nearest", label: "가까운 순" },
  { value: "popular", label: "맛집" },
  { value: "group", label: "단체" },
] as const;

afterEach(() => {
  cleanup();
});

describe("SegmentedControl", () => {
  it("선택지를 순서대로 그리고 고른 칸만 눌린 상태로 알린다", () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        value="popular"
        onChange={() => undefined}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual([
      "가까운 순",
      "맛집",
      "단체",
    ]);
    expect(
      buttons.map((button) => button.getAttribute("aria-pressed")),
    ).toEqual(["false", "true", "false"]);
    expect(
      buttons.every((button) => button.getAttribute("type") === "button"),
    ).toBe(true);
  });

  it("칸을 누르면 그 값을 알린다", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        value="nearest"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "단체" }));

    expect(onChange).toHaveBeenCalledWith("group");
  });

  it("보이는 칸은 28px이고 누르는 영역은 위아래 8px씩 늘린다(44px)", () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        value="nearest"
        onChange={() => undefined}
      />,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button.className).toContain("h-7");
      expect(button.className).toContain("before:-top-2");
      expect(button.className).toContain("before:-bottom-2");
    }
  });
});
