import { ActionArea, Button, Header } from "@moyeorak/design-system";
import type { HTMLAttributes } from "react";
import { type Control, Controller } from "react-hook-form";
import { GuideTimeSelection } from "@/domains/schedule/components/guide-time-selection";
import type { ScheduleVoteFormValues } from "@/domains/schedule/hooks/use-schedule-vote-form";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";
import { Modal } from "@/shared/components/modal";
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
      <Header
        title={title}
        onBack={onBack}
        actionLabel="초기화"
        onAction={onReset}
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

      <FloatingScrollTop top={4} className="bottom-[132px]" />

      <ActionArea
        type="single"
        className="fixed inset-x-0 bottom-0 z-30 mx-auto sm:max-w-[375px]"
        supportingItem={<GuideTimeSelection />}
        main={
          <Button
            size="xl"
            display="full"
            variant="default"
            className={cn(
              isButtonDisabledStyle &&
                "bg-fill-neutral-default-disabled text-fg-neutral-subtler enabled:active:bg-fill-neutral-default-disabled",
            )}
            onClick={handleSubmitClick}
          >
            완료
          </Button>
        }
      />

      <Modal
        isOpen={isResetConfirmOpen}
        onClose={onCancelResetConfirm}
        title="입력한 일정을 모두 지울까요?"
        caption="입력한 내용이 모두 사라져요."
        secondaryButton={{
          label: "취소",
          onClick: onCancelResetConfirm,
          color: "gray",
        }}
        primaryButton={{
          label: "초기화",
          onClick: onConfirmReset,
          color: "blue",
        }}
      />

      <ReactHookFormDevtools control={control} />
    </section>
  );
}
