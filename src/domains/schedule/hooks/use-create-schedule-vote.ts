import { useMutation } from "@tanstack/react-query";
import { createScheduleVote } from "@/domains/schedule/apis/schedule-api";

export function useCreateScheduleVote() {
  return useMutation({ mutationFn: createScheduleVote });
}
