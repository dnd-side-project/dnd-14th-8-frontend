import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TimetableSlot } from "@/shared/components/timetable-slot";

describe("TimetableSlot", () => {
  it("renders a button when the slot can be selected", () => {
    const markup = renderToStaticMarkup(
      <TimetableSlot dataDateIdx={1} dataSlotIdx={2} />,
    );

    expect(markup).toContain("<button");
  });

  it("renders a non-interactive cell when the slot is read-only", () => {
    const markup = renderToStaticMarkup(
      <TimetableSlot isDisabled dataDateIdx={1} dataSlotIdx={2} />,
    );

    expect(markup).not.toContain("<button");
  });

  it("keeps the position data attributes on a read-only cell so taps can be located", () => {
    const markup = renderToStaticMarkup(
      <TimetableSlot isDisabled dataDateIdx={1} dataSlotIdx={2} />,
    );

    expect(markup).toContain('data-date-idx="1"');
    expect(markup).toContain('data-slot-idx="2"');
  });
});
