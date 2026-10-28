import { describe, expect, it } from "vitest";
import type { MyMeetingResponse } from "@/domains/meeting/types/meeting-api-types";
import { getRecentMeetingNavigationTarget } from "@/domains/meeting/utils/recent-meeting-navigation";

describe("getRecentMeetingNavigationTarget", () => {
  it("returns the schedule path when only schedule flow is available", () => {
    const meeting = createMeeting({ availableFlows: ["SCHEDULE"] });

    expect(getRecentMeetingNavigationTarget(meeting)).toBe(
      "/meetings/meeting-id/schedule",
    );
  });

  it("returns the location stations path when only location flow is available", () => {
    const meeting = createMeeting({ availableFlows: ["LOCATION"] });

    expect(getRecentMeetingNavigationTarget(meeting)).toBe(
      "/meetings/meeting-id/location/stations",
    );
  });

  it("returns null when both flows are available so the caller can show a selector", () => {
    const meeting = createMeeting({
      availableFlows: ["SCHEDULE", "LOCATION"],
    });

    expect(getRecentMeetingNavigationTarget(meeting)).toBeNull();
  });

  it("falls back to schedule when the backend has not sent available flows yet", () => {
    const meeting = createMeeting({ availableFlows: undefined });

    expect(getRecentMeetingNavigationTarget(meeting)).toBe(
      "/meetings/meeting-id/schedule",
    );
  });
});

function createMeeting(
  overrides: Partial<MyMeetingResponse> = {},
): MyMeetingResponse {
  return {
    availableFlows: ["SCHEDULE"],
    createdAt: "2026-07-23T14:10:00",
    hostName: "민수",
    isHost: true,
    meetingId: "meeting-id",
    participantCount: 4,
    ...overrides,
  };
}
