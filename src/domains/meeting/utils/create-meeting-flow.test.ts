import { describe, expect, it } from "vitest";
import { getCreateMeetingFlow } from "@/domains/meeting/utils/create-meeting-flow";

describe("getCreateMeetingFlow", () => {
  it("returns LOCATION when creating a location meeting", () => {
    expect(getCreateMeetingFlow("location")).toBe("LOCATION");
  });

  it("returns SCHEDULE for schedule and unknown meeting flows", () => {
    expect(getCreateMeetingFlow("schedule")).toBe("SCHEDULE");
    expect(getCreateMeetingFlow(undefined)).toBe("SCHEDULE");
  });
});
