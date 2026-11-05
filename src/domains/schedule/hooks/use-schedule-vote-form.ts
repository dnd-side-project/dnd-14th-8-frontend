import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";
import { useCreateScheduleVote } from "@/domains/schedule/hooks/use-create-schedule-vote";
import { getMeetingScheduleVoteResultsQueryKey } from "@/domains/schedule/hooks/use-get-meeting-schedule-vote-results";
import {
  getMeetingSchedulesQueryKey,
  useGetMeetingSchedules,
} from "@/domains/schedule/hooks/use-get-meeting-schedules";
import {
  getMyParticipantQueryKey,
  useGetMyParticipant,
} from "@/domains/schedule/hooks/use-get-my-participant";
import { useUpdateScheduleVote } from "@/domains/schedule/hooks/use-update-schedule-vote";
import { parseTime } from "@/domains/schedule/utils/parse";
import {
  normalizeScheduleVoteId,
  toIsoDates,
} from "@/domains/schedule/utils/schedule-vote";
import { getParticipantVotedDates } from "@/domains/schedule/utils/timetable";
import { toast } from "@/shared/components/toast";
import {
  useFlowEntryIndex,
  useFlowReturn,
} from "@/shared/hooks/use-flow-return";
import { useUnsavedChangesGuard } from "@/shared/hooks/use-unsaved-changes-guard";
import { getGuestId } from "@/shared/utils/auth";

const NAME_MAX_LENGTH = 4;

// 검증 메시지는 입력칸 안내와 토스트에 함께 쓰여서, 토스트 문구 검사가 읽을 수 있게 상수로 둔다.
const NAME_REQUIRED_MESSAGE = "이름을 입력해주세요";
const NAME_TOO_LONG_MESSAGE = "최대 4자까지 입력할 수 있어요";
const NO_SELECTED_TIME_MESSAGE = "가능한 시간을 선택해주세요";

const scheduleVoteFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, NAME_REQUIRED_MESSAGE)
    .max(NAME_MAX_LENGTH, NAME_TOO_LONG_MESSAGE),
  selectedDates: z.array(z.date()).min(1, NO_SELECTED_TIME_MESSAGE),
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
  const queryClient = useQueryClient();
  const { meetingId } = useParams();

  const currentMeetingId = meetingId ?? "sample-meeting-id";
  const schedulePath = `/meetings/${currentMeetingId}/schedule`;
  // 폼을 새로 push하면 뒤로가기가 이미 제출한 폼으로 돌아온다.
  const entryIdx = useFlowEntryIndex();
  const leaveForm = useFlowReturn({ entryIdx, fallbackPath: schedulePath });
  const [localStorageKey] = useState(getGuestId);

  // ── Queries ──
  const schedulesQuery = useGetMeetingSchedules({
    meetingId: currentMeetingId,
  });
  const myParticipantQuery = useGetMyParticipant({
    meetingId: currentMeetingId,
  });

  const normalizedVoteId = normalizeScheduleVoteId(
    myParticipantQuery.data?.scheduleVoteId,
  );
  const isEditMode = normalizedVoteId !== undefined;
  const pageTitle = isEditMode ? "일정 수정" : "일정 추가";

  // ── Initial data ──
  const initialData = useMemo<ScheduleVoteFormInitialData | undefined>(() => {
    if (!schedulesQuery.data) {
      return undefined;
    }

    const startTime = parseTime(schedulesQuery.data.startTime, 9);
    const endTime = parseTime(schedulesQuery.data.endTime, 24);
    const hasValidRange = endTime > startTime;
    const myParticipantName = myParticipantQuery.data?.name;

    const selectedDates = myParticipantName
      ? getParticipantVotedDates(
          schedulesQuery.data.participants,
          myParticipantName,
        )
      : [];

    return {
      endTime: hasValidRange ? endTime : 24,
      participantName: myParticipantName ?? "",
      selectedDates,
      startTime: hasValidRange ? startTime : 9,
      timetableDates: schedulesQuery.data.dateOptions.map(
        (dateOption) => new Date(dateOption),
      ),
    };
  }, [myParticipantQuery.data, schedulesQuery.data]);

  // ── Form state ──
  const {
    control,
    formState: { isDirty, isValid },
    getFieldState,
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
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // 서버 데이터가 로드되면 form 전체를 초기화한다. 입력을 시작하기 전에 에러가
  // 보이지 않도록 여기서는 검증하지 않는다(handleSubmitBlocked 참고).
  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      name: initialData.participantName,
      selectedDates: initialData.selectedDates,
    });
  }, [initialData, reset]);

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

  const isPending = schedulesQuery.isPending;

  // ── Actions ──
  // 최적일정 탭(ScheduleMainOptimalContent)이 schedule-vote/results를
  // 별도로 구독하므로 해당 캐시도 함께 무효화한다.
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
      const participantId = myParticipantQuery.data?.participantId;

      if (!normalizedVoteId || !participantId) {
        throw new Error("수정할 일정 투표 ID가 필요해요.");
      }

      await updateVoteMutation.mutateAsync({
        payload: {
          participantId,
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
    leaveForm();
  });

  const handleConfirmReset = async () => {
    setIsResetConfirmOpen(false);

    if (isEditMode) {
      const participantId = myParticipantQuery.data?.participantId;

      if (!normalizedVoteId || !participantId) {
        throw new Error("수정할 일정 투표 ID가 필요해요.");
      }

      await clearVoteMutation.mutateAsync({
        payload: {
          participantId,
          participantName: getValues("name").trim(),
          votedDates: [],
        },
        scheduleVoteId: normalizedVoteId,
      });
      await invalidateScheduleQueries();
    }

    // 이름은 유지하고 selectedDates만 초기화, isDirty = false로 기준점 재설정.
    // 이름 칸에 보이던 에러는 이름이 그대로이므로 함께 유지한다.
    const currentName = getValues("name");
    reset({ name: currentName, selectedDates: [] }, { keepErrors: true });
    toast.success("입력한 일정이 초기화되었어요");
  };

  const handleBack = () => {
    if (isDirty) {
      setIsExitConfirmOpen(true);
      return;
    }

    leaveForm();
  };

  const handleConfirmExit = () => {
    setIsExitConfirmOpen(false);
    leaveForm();
  };

  const handleSubmitBlocked = async () => {
    // 미리 검증하지 않으므로 누른 시점에 검증한다. 렌더 시점의 errors는 이전 값이라
    // getFieldState로 방금 나온 결과를 읽는다.
    await trigger();

    const nameErrorMessage = getFieldState("name").error?.message;
    if (nameErrorMessage) {
      toast.error(nameErrorMessage);
      return;
    }

    toast.error(
      getFieldState("selectedDates").error?.message ?? NO_SELECTED_TIME_MESSAGE,
    );
  };

  return {
    // Form — Controller 연결용
    control,
    // View props
    canSubmit: isValid,
    endTime: initialData?.endTime ?? 24,
    isExitConfirmOpen,
    isPending,
    isResetConfirmOpen,
    isSubmitPending: isMutating,
    maxNameLength: NAME_MAX_LENGTH,
    pageTitle,
    startTime: initialData?.startTime ?? 9,
    timetableDates: initialData?.timetableDates ?? [],
    // Actions
    onBack: handleBack,
    onCancelExitConfirm: () => setIsExitConfirmOpen(false),
    onCancelResetConfirm: () => setIsResetConfirmOpen(false),
    onConfirmExit: handleConfirmExit,
    onConfirmReset: () => void handleConfirmReset(),
    onReset: () => setIsResetConfirmOpen(true),
    onSubmit: () => void submitFormHandler(),
    onSubmitBlocked: () => void handleSubmitBlocked(),
  };
}
