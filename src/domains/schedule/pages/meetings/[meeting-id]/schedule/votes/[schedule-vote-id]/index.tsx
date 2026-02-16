import { useParams } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleVotesEditPage() {
  const { meetingId, scheduleVoteId } = useParams();

  return (
    <MobileLayout>
      <section className="flex flex-col gap-4 p-5">
        <h1 className="text-h2 text-k-900">일정 수정하기</h1>
        <p className="text-b5 text-k-700">meetingId: {meetingId}</p>
        <p className="text-b5 text-k-700">scheduleVoteId: {scheduleVoteId}</p>
      </section>
    </MobileLayout>
  );
}
