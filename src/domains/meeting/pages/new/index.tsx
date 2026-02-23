import { Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useCreateMeetingForm } from "@/domains/meeting/hooks/use-create-meeting-form";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { Stepper } from "@/shared/components/stepper";
import { TextField } from "@/shared/components/text-field";

export function NewMeetingPage() {
  const navigate = useNavigate();
  const { flow } = useParams();

  const {
    control,
    watch,
    setValue,
    errors,
    canSubmit,
    isSubmitPending,
    maxNameLength,
    onSubmit,
    onSubmitBlocked,
  } = useCreateMeetingForm(flow);

  const participantName = watch("participantName");
  const participantCount = watch("participantCount");

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="모임정보 입력" onBack={() => navigate("/")} />

        {/* 이름 입력 */}
        <Controller
          control={control}
          name="participantName"
          render={({ field }) => (
            <TextField
              {...field}
              label="방장 이름"
              placeholder="이름을 입력해주세요"
              maxLength={maxNameLength}
              className="mt-3"
              status={errors.participantName ? "error" : "default"}
              helperText={
                errors.participantName?.message ??
                (participantName
                  ? `최대 ${maxNameLength}자까지 적을 수 있어요`
                  : "")
              }
            />
          )}
        />

        {/* 인원 수 */}
        <Stepper
          label="인원 수"
          value={participantCount}
          onChange={(value) =>
            setValue("participantCount", value, { shouldValidate: true })
          }
          className="mt-6"
        />

        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            disabled={!canSubmit || isSubmitPending}
            onClick={canSubmit ? onSubmit : onSubmitBlocked}
          >
            모임 생성하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
