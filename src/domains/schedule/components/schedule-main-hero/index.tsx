import { useMemo } from "react";
import GraphicPlaceholder from "@/assets/graphic/placeholder.svg?react";
import { ScheduleEdit } from "@/domains/schedule/components/schedule-edit";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { useListParticipants } from "@/domains/schedule/hooks/use-list-participants";

export interface ScheduleMainHeroProps {
  meetingId: string;
  onEditSchedule: () => void;
}

export function ScheduleMainHero({
  meetingId,
  onEditSchedule,
}: ScheduleMainHeroProps) {
  const { data, isPending } = useGetMyParticipant({ meetingId });

  if (isPending) {
    return <ScheduleMainHeroSkeleton />;
  }

  if (data?.isHost) {
    return (
      <ScheduleMainHeroForHost
        meetingId={meetingId}
        onEditSchedule={onEditSchedule}
      />
    );
  } else {
    return <ScheduleMainHeroForParticipant meetingId={meetingId} />;
  }
}

function ScheduleMainHeroSkeleton() {
  return null;
}

function ScheduleMainHeroForHost({
  meetingId,
  onEditSchedule,
}: {
  meetingId: string;
  onEditSchedule: () => void;
}) {
  const { data, isPending } = useGetMeetingSchedules({ meetingId });

  if (!data || isPending) {
    return <ScheduleMainHeroSkeleton />;
  }

  return (
    <section className="w-full bg-k-50 px-5 pt-6 pb-4">
      <div className="relative mb-5">
        <h1 className="break-keep text-h1 text-k-900">
          팀원에게 링크를
          <br />
          <span className="text-primary-main">공유</span>해보세요!
        </h1>
        <GraphicPlaceholder className="absolute right-0 -bottom-12 size-[118px] text-k-300" />
      </div>
      <ScheduleEdit
        dates={data.dateOptions.map((date) => new Date(date))}
        startTime={data.startTime}
        endTime={data.endTime}
        onEdit={onEditSchedule}
        className="relative"
      />
    </section>
  );
}

function ScheduleMainHeroForParticipant({ meetingId }: { meetingId: string }) {
  const { data, isPending } = useListParticipants({ meetingId });

  const hostName = useMemo(() => {
    const host = data?.participants.find((participant) => participant.isHost);
    return host?.name ?? "팀장";
  }, [data?.participants]);

  if (isPending) {
    return <ScheduleMainHeroSkeleton />;
  }

  return (
    <section className="relative w-full bg-k-50 px-5 pt-6 pb-5">
      <h1 className="break-keep text-h1 text-k-900">
        <span className="text-primary-main">{hostName}</span>님과 모임을
        <br />
        시작해보세요!
      </h1>
      <GraphicPlaceholder className="absolute right-0 -bottom-8 size-[118px] text-k-300" />
    </section>
  );
}
