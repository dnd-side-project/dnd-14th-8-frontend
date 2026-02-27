import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { NAME_MAX_LENGTH } from "@/domains/location/hooks/use-create-departure-form";
import { getDeparturesQueryKey } from "@/domains/location/hooks/use-get-departures";
import { getMidpointRecommendationsQueryKey } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { useUpdateDeparture } from "@/domains/location/hooks/use-update-departure";
import type { UpdateLocationVoteRequest } from "@/domains/location/types/location-api-types";
import { toast } from "@/shared/components/toast";

export const updateDepartureFormSchema = z.object({
  participantName: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .max(NAME_MAX_LENGTH, `최대 ${NAME_MAX_LENGTH}자까지 적을 수 있어요`),
  departureLocation: z.string().min(1, "출발지를 선택해주세요"),
  departureLat: z.string().min(1),
  departureLng: z.string().min(1),
});

export type UpdateDepartureFormValues = z.infer<
  typeof updateDepartureFormSchema
>;

export function useUpdateDepartureForm({
  meetingId,
  locationVoteId,
  initialValues,
}: {
  meetingId: string;
  locationVoteId: number;
  initialValues?: Partial<UpdateDepartureFormValues>;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateDepartureMutation = useUpdateDeparture();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateDepartureFormValues>({
    resolver: zodResolver(updateDepartureFormSchema),
    defaultValues: {
      participantName: initialValues?.participantName ?? "",
      departureLocation: initialValues?.departureLocation ?? "",
      departureLat: initialValues?.departureLat ?? "",
      departureLng: initialValues?.departureLng ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const requestPayload: UpdateLocationVoteRequest = {
        participantName: data.participantName,
        departureLocation: data.departureLocation,
        departureLat: data.departureLat,
        departureLng: data.departureLng,
      };

      await updateDepartureMutation.mutateAsync({
        locationVoteId,
        payload: requestPayload,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getDeparturesQueryKey({ meetingId }),
        }),
        queryClient.invalidateQueries({
          queryKey: getMidpointRecommendationsQueryKey({ meetingId }),
        }),
        queryClient.invalidateQueries({
          queryKey: ["locations", "personal-route", meetingId],
        }),
      ]);

      toast.success("출발지가 수정되었어요");
      navigate(`/meetings/${meetingId}/location/votes`);
    } catch (error) {
      console.error("출발지 수정 실패:", error);
      toast.error("출발지 수정에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  });

  return {
    control,
    watch,
    setValue,
    errors,
    canSubmit:
      !!watch("participantName")?.trim() &&
      !!watch("departureLocation") &&
      !!watch("departureLat") &&
      !!watch("departureLng") &&
      watch("departureLat") !== "undefined" &&
      watch("departureLng") !== "undefined",
    isSubmitPending: updateDepartureMutation.isPending,
    maxNameLength: NAME_MAX_LENGTH,
    onSubmit,
  };
}
