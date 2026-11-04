import { ActionArea, Button, Header, TextField } from "@moyeorak/design-system";
import { Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  PARTICIPANT_COUNT_MAX,
  PARTICIPANT_COUNT_MIN,
  ParticipantCountChips,
} from "@/domains/meeting/components/participant-count-chips";
import { useCreateMeetingForm } from "@/domains/meeting/hooks/use-create-meeting-form";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function NewMeetingPage() {
  const navigate = useNavigate();
  const { flow } = useParams();

  const {
    control,
    errors,
    canSubmit,
    isSubmitPending,
    maxNameLength,
    onSubmit,
  } = useCreateMeetingForm(flow);

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5">
        <Header
          title="모임 생성"
          onBack={() => navigate("/")}
          className="-mx-5 w-auto"
        />

        {/* 이름 입력 */}
        <Controller
          control={control}
          name="participantName"
          render={({ field }) => (
            <TextField
              {...field}
              label="모임장 이름"
              placeholder="이름을 입력해주세요"
              autoComplete="off"
              maxCharacterCount={maxNameLength}
              className="mt-3"
              onClear={() => field.onChange("")}
              helperText={`최대 ${maxNameLength}자까지 입력할 수 있어요`}
              errorMessage={errors.participantName?.message}
            />
          )}
        />

        {/* 인원 */}
        <Controller
          control={control}
          name="participantCount"
          render={({ field }) => (
            <ParticipantCountChips
              value={field.value}
              onChange={field.onChange}
              helperText={`${PARTICIPANT_COUNT_MIN}명부터 ${PARTICIPANT_COUNT_MAX}명까지 고를 수 있어요`}
              className="mt-6"
            />
          )}
        />

        <ActionArea
          type="single"
          className="-mx-5 mt-auto w-auto"
          main={
            <Button
              size="xl"
              display="full"
              variant="default"
              disabled={!canSubmit || isSubmitPending}
              onClick={onSubmit}
            >
              모임 생성하기
            </Button>
          }
        />
      </section>
    </MobileLayout>
  );
}
