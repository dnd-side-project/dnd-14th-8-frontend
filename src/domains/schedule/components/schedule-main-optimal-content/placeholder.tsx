import type { ReactNode } from "react";
import GraphicPlaceholder from "@/assets/graphic/placeholder.svg?react";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";

export function ScheduleMainOptimalPlaceholder({
  meetingId,
}: {
  meetingId: string;
}) {
  const { data, isPending } = useGetMeetingSchedules({ meetingId });
  const votedParticipantCount = data?.votedParticipantCount ?? 0;

  if (isPending) {
    return (
      <PlaceholderContent
        title="최적 일정을 불러오는 중이에요."
        description="잠시만 기다려주세요."
      />
    );
  }

  if (votedParticipantCount <= 1) {
    return (
      <PlaceholderContent
        title={
          <>
            아직 2명 이상의 일정이
            <br />
            등록되지 않았어요.
          </>
        }
        description="링크를 공유하거나 일정을 등록해 보세요."
      />
    );
  }

  return (
    <PlaceholderContent
      title="겹치는 시간대가 아직 없어요."
      description="시간 범위를 넓히거나 일정을 다시 등록해 보세요."
    />
  );
}

export function PlaceholderContent({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="grid min-h-0 flex-1 place-items-center">
      <div className="flex flex-col items-center text-center">
        <GraphicPlaceholder className="size-[172px] text-k-300" />
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-k-700 text-t1">{title}</p>
          <p className="text-b4 text-k-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
