import { useParams } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleEditParticipantsPage() {
  const { meetingId } = useParams();

  return (
    <MobileLayout>
      <section className="flex flex-col gap-4 p-5">
        <h1 className="text-h2 text-k-900">모임 인원 수정</h1>
        <p className="text-b5 text-k-700">meetingId: {meetingId}</p>
      </section>
    </MobileLayout>
  );
}
