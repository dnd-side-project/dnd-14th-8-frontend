import { useMutation } from "@tanstack/react-query";
import { deleteLocationVote } from "@/domains/location/apis/location-api";

export function useDeleteDeparture() {
  return useMutation({
    mutationFn: deleteLocationVote,
  });
}
