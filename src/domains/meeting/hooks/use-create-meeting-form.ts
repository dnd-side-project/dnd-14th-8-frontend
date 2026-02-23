import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { useCreateMeeting } from "@/domains/meeting/hooks/use-create-meeting";
import { toast } from "@/shared/components/toast";
import { getGuestId, setMeetingSession } from "@/shared/utils/auth";

export const NAME_MAX_LENGTH = 4;

export const createMeetingFormSchema = z.object({
  participantName: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .max(NAME_MAX_LENGTH, `최대 ${NAME_MAX_LENGTH}자까지 적을 수 있어요`),
  participantCount: z.number().min(2),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingFormSchema>;

export function useCreateMeetingForm(flow?: string) {
  const navigate = useNavigate();
  const createMeetingMutation = useCreateMeeting();

  const localStorageKey = getGuestId();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateMeetingFormValues>({
    resolver: zodResolver(createMeetingFormSchema),
    defaultValues: {
      participantName: "",
      participantCount: 2,
    },
    mode: "onChange",
  });

  const submitHandler = handleSubmit(async (data) => {
    try {
      const trimmedName = data.participantName.trim();

      const response = await createMeetingMutation.mutateAsync({
        localStorageKey,
        participantName: trimmedName,
        participantCount: data.participantCount,
      });

      const meetingId = response.data.data;

      setMeetingSession(meetingId, trimmedName);

      navigate(
        flow === "location"
          ? `/meetings/${meetingId}/location`
          : `/meetings/${meetingId}/schedule`,
      );
    } catch (error) {
      console.error("모임 생성 실패:", error);
      toast.error("모임 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  });

  return {
    // form
    control,
    watch,
    setValue,

    // view
    errors,
    canSubmit: isValid,
    isSubmitPending: createMeetingMutation.isPending,
    maxNameLength: NAME_MAX_LENGTH,

    // actions
    onSubmit: () => void submitHandler(),
  };
}
