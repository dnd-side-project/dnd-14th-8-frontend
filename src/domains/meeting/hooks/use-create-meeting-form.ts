import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { useCreateMeeting } from "@/domains/meeting/hooks/use-create-meeting";
import { getGuestId, setMeetingSession } from "@/shared/utils/auth";

export const NAME_MAX_LENGTH = 4;

export const createMeetingFormSchema = z.object({
  participantName: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .max(NAME_MAX_LENGTH, "최대 4자까지 적을 수 있어요"),
  participantCount: z.number().min(2),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingFormSchema>;

export function useCreateMeetingForm() {
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

  const isPending = createMeetingMutation.isPending;

  const submitHandler = handleSubmit(async (data) => {
    const trimmedName = data.participantName.trim();

    const response = await createMeetingMutation.mutateAsync({
      localStorageKey,
      participantName: trimmedName,
      participantCount: data.participantCount,
    });

    const meetingId = response.data.data;

    setMeetingSession(meetingId, trimmedName);

    navigate(`/meetings/${meetingId}/schedule?tab=vote`);
  });

  const handleSubmitBlocked = () => {
    if (errors.participantName?.message) {
      return;
    }
  };

  return {
    // form
    control,
    watch,
    setValue,

    // view
    errors,
    canSubmit: isValid,
    isSubmitPending: isPending,
    maxNameLength: NAME_MAX_LENGTH,

    // actions
    onSubmit: () => void submitHandler(),
    onSubmitBlocked: handleSubmitBlocked,
  };
}
