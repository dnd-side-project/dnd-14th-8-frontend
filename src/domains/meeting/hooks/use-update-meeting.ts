import { useMutation } from "@tanstack/react-query";
import { updateMeeting } from "@/domains/meeting/apis/meeting-api";

export function useUpdateMeeting() {
  return useMutation({ mutationFn: updateMeeting });
}
