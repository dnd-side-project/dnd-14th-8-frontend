import { useMutation } from "@tanstack/react-query";
import { updateLocationVote } from "@/domains/location/apis/location-api";

export function useUpdateDeparture() {
  return useMutation({ mutationFn: updateLocationVote });
}
