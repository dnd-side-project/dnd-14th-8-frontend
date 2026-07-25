import type { MyMeetingResponse } from "@/domains/meeting/types/meeting-api-types";

export function getRecentMeetingNavigationTarget(meeting: MyMeetingResponse) {
  const flows = meeting.availableFlows ?? [];
  const hasSchedule = flows.includes("SCHEDULE");
  const hasLocation = flows.includes("LOCATION");

  if (hasSchedule && hasLocation) {
    return null;
  }

  if (hasLocation) {
    return `/meetings/${meeting.meetingId}/location/stations`;
  }

  return `/meetings/${meeting.meetingId}/schedule`;
}
