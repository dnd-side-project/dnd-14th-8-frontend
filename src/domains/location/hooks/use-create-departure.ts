import { useMutation } from "@tanstack/react-query";
import { createLocationVote } from "@/domains/location/apis/location-api";

export function useCreateDeparture() {
  return useMutation({ mutationFn: createLocationVote });
}
