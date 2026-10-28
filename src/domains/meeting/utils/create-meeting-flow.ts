import type { MeetingFlow } from "@/domains/meeting/types/meeting-api-types";

export function getCreateMeetingFlow(flow?: string): MeetingFlow {
  return flow === "location" ? "LOCATION" : "SCHEDULE";
}
