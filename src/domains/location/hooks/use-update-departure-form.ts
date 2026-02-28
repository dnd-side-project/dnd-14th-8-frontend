import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { getDeparturesQueryKey } from "@/domains/location/hooks/use-get-departures";
import { useUpdateDeparture } from "@/domains/location/hooks/use-update-departure";
import { toast } from "@/shared/components/toast";

const NAME_MAX_LENGTH = 4;

export const updateDepartureFormSchema = z.object({
  locationVoteId: z.number(),
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

export type UpdateDepartureFormValues = z.infer<
  typeof updateDepartureFormSchema
>;

export function useUpdateDepartureForm(
  meetingId: string,
  locationVoteId: number,
  initialValues?: Partial<UpdateDepartureFormValues>,
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateDeparture();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateDepartureFormValues>({
    resolver: zodResolver(updateDepartureFormSchema),
    defaultValues: {
      locationVoteId,
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
      // 해결 포인트: 인자 구조를 { locationVoteId, payload } 형태로 변경
      await updateMutation.mutateAsync({
        locationVoteId: data.locationVoteId, // Path Parameter
        payload: {
          // Request Body Payload
          participantName: data.participantName || "",
          departureLocation: data.departureLocation,
          departureLat: data.departureLat,
          departureLng: data.departureLng,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: getDeparturesQueryKey({ meetingId }),
      });

      toast.success("출발지가 수정되었어요");
      navigate(`/meetings/${meetingId}/location/votes`);
    } catch (error) {
      // 'error' 변수 미사용 경고 해결을 위해 로깅 추가
      console.error("수정 중 에러 발생:", error);
      toast.error("수정에 실패했어요.");
    }
  });

  return {
    control,
    watch,
    setValue,
    errors,
    isDirty,
    onSubmit,
    isPending: updateMutation.isPending,
    canSubmit:
      !!watch("departureLocation") &&
      (!!watch("participantName")?.trim() || !!watch("participantId")),
    maxNameLength: NAME_MAX_LENGTH,
  };
}
