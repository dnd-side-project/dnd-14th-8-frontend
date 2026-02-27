import { useMutation } from "@tanstack/react-query";
import { confirmSchedulePoll } from "@/domains/schedule/apis/schedule-api";

export function useConfirmSchedulePoll() {
  return useMutation({ mutationFn: confirmSchedulePoll });
}
