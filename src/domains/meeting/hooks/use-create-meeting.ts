import { useMutation } from "@tanstack/react-query";
import { createMeeting } from "@/domains/meeting/apis/meeting-api";

export function useCreateMeeting() {
  return useMutation({ mutationFn: createMeeting });
}
