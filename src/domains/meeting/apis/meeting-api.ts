import type { CreateMeetingRequest } from "@/domains/meeting/types";
import { api } from "@/shared/utils/axios";

export function createMeeting(payload: CreateMeetingRequest) {
  return api.post<string>("/api/meetings", payload);
}
