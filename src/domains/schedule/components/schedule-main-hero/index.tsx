import { useMemo } from "react";
import {
  Schedule1Character,
  Schedule2Character,
  Schedule3Character,
  Schedule4Character,
} from "@/assets/characters";
import { ScheduleEdit } from "@/domains/schedule/components/schedule-edit";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";

export interface ScheduleMainHeroProps {
  meetingId: string;
  onEditSchedule: () => void;
}

function ScheduleMainHeroSkeleton() {
  return null;
}

export function ScheduleMainHero({
  meetingId,
  onEditSchedule,
}: ScheduleMainHeroProps) {
  const { data: myData, isPending: isMyPending } = useGetMyParticipant({
    meetingId,
  });

  if (isMyPending) return <ScheduleMainHeroSkeleton />;

  // 1. 호스트인 경우 (팀장)
  if (myData?.isHost) {
    return (
      <ScheduleMainHeroForHost
        meetingId={meetingId}
        onEditSchedule={onEditSchedule}
      />
    );
  }

  // 2. 참여자인 경우 (팀원)
  return (
    <ScheduleMainHeroForParticipant
      meetingId={meetingId}
      hasMyVote={!!myData?.scheduleVoteId}
    />
  );
}

function ScheduleMainHeroForHost({
  meetingId,
  onEditSchedule,
}: {
  meetingId: string;
  onEditSchedule: () => void;
}) {
  const { data, isPending } = useGetMeetingSchedules({ meetingId });

  const status = useMemo(() => {
    if (!data) return null;
    const { votedParticipantCount: voted, participantCount: total } = data;
    return {
      voted,
      total,
      isAllVoted: voted === total && total > 0,
      isOverHalf: voted >= total / 2 && voted < total,
    };
  }, [data]);

  if (!data || isPending || !status) return <ScheduleMainHeroSkeleton />;

  return (
    <section className="w-full bg-p-50 px-5 pt-6 pb-4">
      <div className="relative mb-5">
        <h1 className="whitespace-pre-line text-h2 text-k-900">
          {status.isAllVoted
            ? "모든 팀원이\n일정을 등록했어요!"
            : status.isOverHalf
              ? "절반 이상이\n일정을 등록했어요!"
              : "팀원들에게 링크를\n공유해보세요!"}
        </h1>
        {status.isAllVoted ? (
          <Schedule4Character className="absolute right-2 -bottom-13.25 size-[118px]" />
        ) : status.isOverHalf ? (
          <Schedule3Character className="absolute right-2 -bottom-13.25 size-[118px]" />
        ) : (
          <Schedule1Character className="absolute right-2 -bottom-13.25 size-[118px]" />
        )}
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

function ScheduleMainHeroForParticipant({
  meetingId,
  hasMyVote,
}: {
  meetingId: string;
  hasMyVote: boolean;
}) {
  const { data, isPending } = useGetMeetingSchedules({ meetingId });

  const status = useMemo(() => {
    if (!data) return null;
    const { votedParticipantCount: voted, participantCount: total } = data;
    return {
      voted,
      total,
      isAllVoted: voted === total && total > 0,
      isOverHalf: voted >= total / 2 && voted < total,
    };
  }, [data]);

  if (!data || isPending || !status) return <ScheduleMainHeroSkeleton />;

  // 텍스트 및 캐릭터 결정 로직
  const getUIContent = () => {
    if (status.isAllVoted)
      return {
        title: "모든 팀원이\n일정을 등록했어요!",
        Char: Schedule4Character,
      };
    if (status.isOverHalf)
      return {
        title: "절반 이상이\n일정을 등록했어요!",
        Char: Schedule3Character,
      };
    if (hasMyVote)
      return {
        title: "일정 등록 완료!\n팀원들을 기다려요",
        Char: Schedule2Character,
      };
    return {
      title: "일정을 등록하고\n모임을 시작해보세요!",
      Char: Schedule1Character,
    };
  };

  const { title, Char } = getUIContent();

  return (
    <section className="relative w-full bg-p-50 px-5 pt-6 pb-5">
      <h1 className="whitespace-pre-line text-h2 text-k-900">{title}</h1>
      <Char className="absolute right-6 -bottom-8.75 size-[118px]" />
    </section>
  );
}
