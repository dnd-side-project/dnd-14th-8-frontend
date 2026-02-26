import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useCreateDeparture } from "@/domains/location/hooks/use-create-departure";
import { getDeparturesQueryKey } from "@/domains/location/hooks/use-get-departures";
import type { CreateLocationVoteRequest } from "@/domains/location/types/location-api-types";
import { toast } from "@/shared/components/toast";
import { getGuestId } from "@/shared/utils/auth";

export const NAME_MAX_LENGTH = 4;

export const createDepartureFormSchema = z.object({
  meetingId: z.string(),
  locationPollId: z.string().optional(),
  participantName: z
    .string()
    .trim()
    .max(NAME_MAX_LENGTH, `최대 ${NAME_MAX_LENGTH}자까지 적을 수 있어요`)
    .optional(),
  participantId: z.string().optional(),
  departureLocation: z.string().min(1, "출발지를 선택해주세요"),
  departureLat: z.string().min(1),
  departureLng: z.string().min(1),
});

export type CreateDepartureFormValues = z.infer<
  typeof createDepartureFormSchema
>;

export function useCreateDepartureForm(
  meetingId: string,
  initialValues?: Partial<CreateDepartureFormValues>,
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createDepartureMutation = useCreateDeparture();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDepartureFormValues>({
    resolver: zodResolver(createDepartureFormSchema),
    defaultValues: {
      meetingId: meetingId,
      locationPollId: initialValues?.locationPollId || "", // 초기값 설정
      participantName: initialValues?.participantName || "",
      participantId: initialValues?.participantId || "",
      departureLocation: initialValues?.departureLocation || "",
      departureLat: initialValues?.departureLat || "",
      departureLng: initialValues?.departureLng || "",
    },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const localStorageKey = getGuestId();

      const requestPayload: CreateLocationVoteRequest = {
        meetingId: data.meetingId,
        localStorageKey: localStorageKey || "",
        participantName: data.participantName || "",
        departureLocation: data.departureLocation,
        departureLat: data.departureLat,
        departureLng: data.departureLng,
        locationPollId: data.locationPollId || "",
      };

      await createDepartureMutation.mutateAsync(requestPayload);
      await queryClient.invalidateQueries({
        queryKey: getDeparturesQueryKey({ meetingId }),
      });

      toast.success("출발지가 추가되었어요");
      navigate(`/meetings/${meetingId}/location/votes`);
    } catch (error) {
      console.error("출발지 추가 실패:", error);
      toast.error("출발지 추가에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  });

  return {
    control,
    watch,
    setValue,
    errors,
    canSubmit:
      !!watch("departureLocation") &&
      !!watch("departureLat") &&
      !!watch("departureLng") &&
      watch("departureLat") !== "undefined" &&
      watch("departureLng") !== "undefined" &&
      (!!watch("participantName")?.trim() || !!watch("participantId")),
    isSubmitPending: createDepartureMutation.isPending,
    maxNameLength: NAME_MAX_LENGTH,
    onSubmit,
  };
}
