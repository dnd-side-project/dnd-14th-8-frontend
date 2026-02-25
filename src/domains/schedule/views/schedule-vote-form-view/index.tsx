import type { HTMLAttributes } from "react";
import { type Control, Controller } from "react-hook-form";
import { GuideTimeSelection } from "@/domains/schedule/components/guide-time-selection";
import type { ScheduleVoteFormValues } from "@/domains/schedule/hooks/use-schedule-vote-form";
import { BottomActionBar } from "@/shared/components/bottom-action-bar";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { ConfirmModal } from "@/shared/components/confirm-modal";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";
import { PageHeader } from "@/shared/components/page-header";
import { ReactHookFormDevtools } from "@/shared/components/react-hook-form-devtools";
import { TextField } from "@/shared/components/text-field";
import { Timetable } from "@/shared/components/timetable";
import { cn } from "@/shared/utils/cn";

export interface ScheduleVoteFormViewProps
  extends HTMLAttributes<HTMLDivElement> {
  control: Control<ScheduleVoteFormValues>;
  canSubmit: boolean;
  endTime: number;
  isPending?: boolean;
  isResetConfirmOpen?: boolean;
  isSubmitPending?: boolean;
  maxNameLength: number;
  title: string;
  startTime: number;
  timetableDates: Date[];
  onBack: () => void;
  onCancelResetConfirm: () => void;
  onConfirmReset: () => void;
  onReset: () => void;
  onSubmit: () => void;
  onSubmitBlocked: () => void;
}

export function ScheduleVoteFormView({
  canSubmit,
  className,
  control,
  endTime,
  isPending = false,
  isResetConfirmOpen = false,
  isSubmitPending = false,
  maxNameLength,
  title,
  onBack,
  onCancelResetConfirm,
  onConfirmReset,
  onReset,
  onSubmit,
  onSubmitBlocked,
  startTime,
  timetableDates,
  ...props
}: ScheduleVoteFormViewProps) {
  const isButtonDisabledStyle = !canSubmit || isPending || isSubmitPending;

  const handleSubmitClick = () => {
    if (isPending || isSubmitPending) {
      return;
    }

    if (!canSubmit) {
      onSubmitBlocked();
      return;
    }

    onSubmit();
  };

  return (
    <section
      className={cn("relative min-h-dvh bg-k-5 pb-[152px]", className)}
      {...props}
    >
      <PageHeader
        title={title}
        onBack={onBack}
        className="px-5"
        rightElement={
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-primary-main text-t2 enabled:active:text-p-500 enabled:hover:text-p-450"
          >
            초기화
          </button>
        }
      />

      <div className="px-5">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="이름"
              value={field.value}
              helperText={fieldState.error?.message}
              status={fieldState.error ? "error" : undefined}
              maxLength={maxNameLength}
              onChange={(event) => field.onChange(event.target.value)}
              onClear={() => field.onChange("")}
              className="mt-1"
            />
          )}
        />

        <Controller
          name="selectedDates"
          control={control}
          render={({ field }) => (
            <Timetable
              className="mt-5"
              dates={timetableDates}
              startTime={startTime}
              endTime={endTime}
              selected={field.value}
              onSelect={field.onChange}
              disabled={isPending || isSubmitPending}
            />
          )}
        />
      </div>

      <FloatingScrollTop top={4} className="bottom-[140px]" />

      <BottomActionBar>
        <GuideTimeSelection />
        <ButtonBottom
          className={cn(
            "mt-4",
            isButtonDisabledStyle &&
              "border-transparent bg-k-100 text-k-400 enabled:active:bg-k-100 enabled:hover:bg-k-100",
          )}
          onClick={handleSubmitClick}
          variant="black"
        >
          완료
        </ButtonBottom>
      </BottomActionBar>

      {isResetConfirmOpen ? (
        <ConfirmModal
          title="입력한 일정을 모두 지울까요?"
          description="입력한 내용이 모두 사라져요"
          onCancel={onCancelResetConfirm}
          onConfirm={onConfirmReset}
        />
      ) : null}

      <ReactHookFormDevtools control={control} />
    </section>
  );
}
