import { ActionArea, Button, Header, Modal } from "@moyeorak/design-system";
import type { HTMLAttributes } from "react";
import { type Control, Controller } from "react-hook-form";
import { GuideTimeSelection } from "@/domains/schedule/components/guide-time-selection";
import type { ScheduleVoteFormValues } from "@/domains/schedule/hooks/use-schedule-vote-form";
import {
  FIXED_BOTTOM_AREA_PADDING_WITH_FLOATING,
  FixedBottomArea,
} from "@/shared/components/fixed-bottom-area";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";
import { ReactHookFormDevtools } from "@/shared/components/react-hook-form-devtools";
import { TextField } from "@/shared/components/text-field";
import { Timetable } from "@/shared/components/timetable";
import { cn } from "@/shared/utils/cn";

export interface ScheduleVoteFormViewProps
  extends HTMLAttributes<HTMLDivElement> {
  control: Control<ScheduleVoteFormValues>;
  canSubmit: boolean;
  endTime: number;
  isExitConfirmOpen?: boolean;
  isPending?: boolean;
  isResetConfirmOpen?: boolean;
  isSubmitPending?: boolean;
  maxNameLength: number;
  title: string;
  startTime: number;
  timetableDates: Date[];
  onBack: () => void;
  onCancelExitConfirm: () => void;
  onCancelResetConfirm: () => void;
  onConfirmExit: () => void;
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
  isExitConfirmOpen = false,
  isPending = false,
  isResetConfirmOpen = false,
  isSubmitPending = false,
  maxNameLength,
  title,
  onBack,
  onCancelExitConfirm,
  onCancelResetConfirm,
  onConfirmExit,
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
      className={cn(
        "relative min-h-dvh bg-bg-neutral-default",
        FIXED_BOTTOM_AREA_PADDING_WITH_FLOATING,
        className,
      )}
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

      <FixedBottomArea floating={<FloatingScrollTop top={4} />}>
        <ActionArea
          type="single"
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
      </FixedBottomArea>

      <Modal
        open={isResetConfirmOpen}
        onOpenChange={onCancelResetConfirm}
        title="입력한 내용을 모두 삭제할까요?"
        body="초기화 후에는 복구할 수 없어요"
        mainLabel="초기화"
        onMain={onConfirmReset}
        alternativeLabel="취소"
        onAlternative={onCancelResetConfirm}
      />

      <Modal
        open={isExitConfirmOpen}
        onOpenChange={onCancelExitConfirm}
        title="저장하지 않고 나가시겠어요?"
        body="입력하신 내용이 모두 사라져요"
        mainLabel="나가기"
        onMain={onConfirmExit}
        alternativeLabel="취소"
        onAlternative={onCancelExitConfirm}
      />

      <ReactHookFormDevtools control={control} />
    </section>
  );
}
