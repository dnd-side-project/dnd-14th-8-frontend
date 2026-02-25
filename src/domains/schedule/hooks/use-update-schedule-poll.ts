import { useMutation } from "@tanstack/react-query";
import { updateSchedulePoll } from "@/domains/schedule/apis/schedule-api";

export function useUpdateSchedulePoll() {
  return useMutation({ mutationFn: updateSchedulePoll });
}
