import { Navigate, useParams } from "react-router";
import { useMeetingPermissions } from "@/domains/meeting/hooks/use-meeting-permissions";
import { useScheduleVoteForm } from "@/domains/schedule/hooks/use-schedule-vote-form";
import { ScheduleVoteFormView } from "@/domains/schedule/views/schedule-vote-form-view";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleVotesPage() {
  const { meetingId } = useParams() as { meetingId: string };
  const { permissions, isLoading } = useMeetingPermissions(meetingId);
  const {
    control,
    canSubmit,
    endTime,
    isExitConfirmOpen,
    isPending,
    isResetConfirmOpen,
    isSubmitPending,
    maxNameLength,
    pageTitle,
    startTime,
    timetableDates,
    onBack,
    onCancelExitConfirm,
    onCancelResetConfirm,
    onConfirmExit,
    onConfirmReset,
    onReset,
    onSubmit,
    onSubmitBlocked,
  } = useScheduleVoteForm();

  // 확정된 모임은 주소로 들어와도 일정을 바꾸지 못하게 일정 메인으로 돌려보낸다.
  if (!isLoading && !permissions.canVote) {
    return <Navigate to={`/meetings/${meetingId}/schedule`} replace />;
  }

  return (
    <MobileLayout>
      <ScheduleVoteFormView
        control={control}
        title={pageTitle}
        canSubmit={canSubmit}
        maxNameLength={maxNameLength}
        startTime={startTime}
        endTime={endTime}
        timetableDates={timetableDates}
        isPending={isPending}
        isSubmitPending={isSubmitPending}
        isExitConfirmOpen={isExitConfirmOpen}
        isResetConfirmOpen={isResetConfirmOpen}
        onBack={onBack}
        onCancelExitConfirm={onCancelExitConfirm}
        onCancelResetConfirm={onCancelResetConfirm}
        onConfirmExit={onConfirmExit}
        onConfirmReset={onConfirmReset}
        onReset={onReset}
        onSubmit={onSubmit}
        onSubmitBlocked={onSubmitBlocked}
      />
    </MobileLayout>
  );
}
