import { useScheduleVoteForm } from "@/domains/schedule/hooks/use-schedule-vote-form";
import { ScheduleVoteFormView } from "@/domains/schedule/views/schedule-vote-form-view";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleVotesPage() {
  const {
    control,
    canSubmit,
    endTime,
    isPending,
    isResetConfirmOpen,
    isSubmitPending,
    maxNameLength,
    pageTitle,
    startTime,
    timetableDates,
    onBack,
    onCancelResetConfirm,
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
        isResetConfirmOpen={isResetConfirmOpen}
        onBack={onBack}
        onCancelResetConfirm={onCancelResetConfirm}
        onConfirmReset={onConfirmReset}
        onReset={onReset}
        onSubmit={onSubmit}
        onSubmitBlocked={onSubmitBlocked}
      />
    </MobileLayout>
  );
}
