import { describe, expect, it } from "vitest";
import { createMeetingFormSchema } from "@/domains/meeting/hooks/use-create-meeting-form";

describe("createMeetingFormSchema", () => {
  it("is invalid until a participant count is chosen", () => {
    const result = createMeetingFormSchema.safeParse({
      participantName: "모임장",
    });
    expect(result.success).toBe(false);
  });

  it("is valid once both the name and the count are filled", () => {
    const result = createMeetingFormSchema.safeParse({
      participantName: "모임장",
      participantCount: 2,
    });
    expect(result.success).toBe(true);
  });
});
