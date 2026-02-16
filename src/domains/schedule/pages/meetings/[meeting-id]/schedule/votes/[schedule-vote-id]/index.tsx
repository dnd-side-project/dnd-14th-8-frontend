import { useNavigate, useParams } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function ScheduleVotesEditPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const currentMeetingId = meetingId ?? "sample-meeting-id";

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader
          title="일정 수정하기"
          onBack={() =>
            navigate(`/meetings/${currentMeetingId}/schedule/votes`)
          }
        />

        <div className="mt-auto">
          <ButtonBottom
            onClick={() => navigate(`/meetings/${currentMeetingId}/schedule`)}
            variant="blue"
          >
            일정 메인으로 이동
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
