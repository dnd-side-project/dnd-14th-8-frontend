import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { useCreateScheduleVote } from "@/domains/schedule/hooks/use-create-schedule-vote";
import {
  getMeetingScheduleVoteResultsQueryKey,
  useGetMeetingScheduleVoteResults,
} from "@/domains/schedule/hooks/use-get-meeting-schedule-vote-results";
import {
  getMeetingSchedulesQueryKey,
  useGetMeetingSchedules,
} from "@/domains/schedule/hooks/use-get-meeting-schedules";
import {
  getMyParticipantQueryKey,
  useGetMyParticipant,
} from "@/domains/schedule/hooks/use-get-my-participant";
import { useUpdateScheduleVote } from "@/domains/schedule/hooks/use-update-schedule-vote";
import { parseHour } from "@/domains/schedule/utils/parse";
import {
  normalizeScheduleVoteId,
  toIsoDates,
} from "@/domains/schedule/utils/schedule-vote";
import { toast } from "@/shared/components/toast";
import { useUnsavedChangesGuard } from "@/shared/hooks/use-unsaved-changes-guard";
import { getGuestId } from "@/shared/utils/auth";

const NAME_MAX_LENGTH = 4;

const scheduleVoteFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .max(NAME_MAX_LENGTH, "최대 4자까지 적을 수 있어요"),
  selectedDates: z.array(z.date()).min(1, "입력된 일정이 없어요"),
});

export type ScheduleVoteFormValues = z.infer<typeof scheduleVoteFormSchema>;

interface ScheduleVoteFormInitialData {
  endTime: number;
  participantName: string;
  selectedDates: Date[];
  startTime: number;
  timetableDates: Date[];
}

export function useScheduleVoteForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { meetingId } = useParams();

  const currentMeetingId = meetingId ?? "sample-meeting-id";
  const schedulePath = `/meetings/${currentMeetingId}/schedule`;
  const [localStorageKey] = useState(getGuestId);

  // ── Queries ──
  const schedulesQuery = useGetMeetingSchedules({
    meetingId: currentMeetingId,
  });
  const voteResultsQuery = useGetMeetingScheduleVoteResults({
    meetingId: currentMeetingId,
  });
  const myParticipantQuery = useGetMyParticipant({
    meetingId: currentMeetingId,
  });

  const normalizedVoteId = normalizeScheduleVoteId(
    myParticipantQuery.data?.scheduleVoteId,
  );
  const isEditMode = normalizedVoteId !== undefined;
  const pageTitle = isEditMode ? "일정 수정하기" : "일정 추가하기";

  // ── Initial data ──
  const initialData = useMemo<ScheduleVoteFormInitialData | undefined>(() => {
    if (
      !schedulesQuery.data ||
      !voteResultsQuery.data ||
      !myParticipantQuery.data
    ) {
      return undefined;
    }

    const startTime = parseHour(schedulesQuery.data.startTime, 9);
    const endTime = parseHour(schedulesQuery.data.endTime, 24);
    const hasValidRange = endTime > startTime;

    return {
      endTime: hasValidRange ? endTime : 24,
      participantName: myParticipantQuery.data.name,
      selectedDates: voteResultsQuery.data.scheduleVoteResult
        .filter((result) =>
          result.availableParticipantNames.includes(
            myParticipantQuery.data.name,
          ),
        )
        .map(
          (result) => new Date(`${result.scheduleDate}T${result.startTime}`),
        ),
      startTime: hasValidRange ? startTime : 9,
      timetableDates: schedulesQuery.data.dateOptions.map(
        (dateOption) => new Date(dateOption),
      ),
    };
  }, [myParticipantQuery.data, schedulesQuery.data, voteResultsQuery.data]);

  // ── Form state ──
  const {
    control,
    formState: { errors, isDirty, isValid },
    getValues,
    handleSubmit,
    reset,
    trigger,
  } = useForm<ScheduleVoteFormValues>({
    defaultValues: { name: "", selectedDates: [] },
    mode: "onChange",
    resolver: zodResolver(scheduleVoteFormSchema),
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 서버 데이터가 로드되면 form 전체를 초기화하고 검증 실행
  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      name: initialData.participantName,
      selectedDates: initialData.selectedDates,
    });
    void trigger();
  }, [initialData, reset, trigger]);

  // ── Mutations ──
  const createVoteMutation = useCreateScheduleVote();
  const updateVoteMutation = useUpdateScheduleVote();
  const clearVoteMutation = useUpdateScheduleVote();

  // ── Derived state ──
  const isMutating =
    createVoteMutation.isPending ||
    updateVoteMutation.isPending ||
    clearVoteMutation.isPending;

  useUnsavedChangesGuard({ enabled: isDirty });

  const isPending =
    schedulesQuery.isPending ||
    voteResultsQuery.isPending ||
    myParticipantQuery.isPending;

  // ── Actions ──
  const invalidateScheduleQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getMeetingSchedulesQueryKey({ meetingId: currentMeetingId }),
      }),
      queryClient.invalidateQueries({
        queryKey: getMeetingScheduleVoteResultsQueryKey({
          meetingId: currentMeetingId,
        }),
      }),
      queryClient.invalidateQueries({
        queryKey: getMyParticipantQueryKey({
          localStorageKey,
          meetingId: currentMeetingId,
        }),
      }),
    ]);
  };

  const submitFormHandler = handleSubmit(async (data) => {
    const trimmedName = data.name.trim();

    if (!isEditMode) {
      await createVoteMutation.mutateAsync({
        meetingId: currentMeetingId,
        payload: {
          localStorageKey,
          participantName: trimmedName,
          votedDates: toIsoDates(data.selectedDates),
        },
      });
    } else {
      if (!normalizedVoteId) {
        throw new Error("수정할 일정 투표 ID가 필요해요.");
      }

      await updateVoteMutation.mutateAsync({
        payload: {
          participantName: trimmedName,
          votedDates: toIsoDates(data.selectedDates),
        },
        scheduleVoteId: normalizedVoteId,
      });
    }

    await invalidateScheduleQueries();
    // 저장 성공 시점을 새 기준점으로 잡아 isDirty를 false로 리셋
    reset(data);
    toast.success(isEditMode ? "일정이 수정되었어요" : "일정이 추가되었어요");
    navigate(schedulePath);
  });

  const handleConfirmReset = async () => {
    setIsResetConfirmOpen(false);

    if (isEditMode) {
      if (!normalizedVoteId) {
        throw new Error("수정할 일정 투표 ID가 필요해요.");
      }

      await clearVoteMutation.mutateAsync({
        payload: { votedDates: [] },
        scheduleVoteId: normalizedVoteId,
      });
      await invalidateScheduleQueries();
    }

    // 이름은 유지하고 selectedDates만 초기화, isDirty = false로 기준점 재설정
    const currentName = getValues("name");
    reset({ name: currentName, selectedDates: [] });
    void trigger();
    toast.success("시간표가 초기화되었어요");
  };

  const handleSubmitBlocked = () => {
    if (errors.name?.message) {
      toast.error(errors.name.message);
      return;
    }

    toast.error(errors.selectedDates?.message ?? "입력된 일정이 없어요");
  };

  return {
    // Form — Controller 연결용
    control,
    // View props
    canSubmit: isValid,
    endTime: initialData?.endTime ?? 24,
    isPending,
    isResetConfirmOpen,
    isSubmitPending: isMutating,
    maxNameLength: NAME_MAX_LENGTH,
    pageTitle,
    startTime: initialData?.startTime ?? 9,
    timetableDates: initialData?.timetableDates ?? [],
    // Actions
    onBack: () => navigate(schedulePath),
    onCancelResetConfirm: () => setIsResetConfirmOpen(false),
    onConfirmReset: () => void handleConfirmReset(),
    onReset: () => setIsResetConfirmOpen(true),
    onSubmit: () => void submitFormHandler(),
    onSubmitBlocked: handleSubmitBlocked,
  };
}
