// import { Controller } from "react-hook-form";

import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { Stepper } from "@/shared/components/stepper";
// import { Stepper } from "@/shared/components/stepper";

export function MeetingEditParticipantsPage() {
  const navigate = useNavigate();
  const { meetingId, flow } = useParams();
  const currentMeetingId = meetingId ?? "sample-meeting-id";
  const [count, setCount] = useState(2);

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader
          title="모임 인원 수정"
          // TODO: 수정
          onBack={() => navigate(`/meetings/${currentMeetingId}/schedule`)}
        />

        {/* <Controller
          control={control}
          name="participantCount"
          render={({ field }) => (
            <Stepper
              label="인원 수"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        /> */}

        <Stepper label="인원 수" value={count} onChange={setCount} />

        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            // disabled={!canSubmit || isSubmitPending}
            // onClick={onSubmit}
          >
            완료
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
