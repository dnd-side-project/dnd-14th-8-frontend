import { useScheduleVoteForm } from "@/domains/schedule/hooks/use-schedule-vote-form";
import { ScheduleVoteFormView } from "@/domains/schedule/views/schedule-vote-form-view";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleVotesPage() {
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
