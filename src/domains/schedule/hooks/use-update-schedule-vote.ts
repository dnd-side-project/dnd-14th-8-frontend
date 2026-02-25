import { useMutation } from "@tanstack/react-query";
import { updateScheduleVote } from "@/domains/schedule/apis/schedule-api";

export function useUpdateScheduleVote() {
  return useMutation({ mutationFn: updateScheduleVote });
}
