import { Empty1Character } from "@/assets/characters";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { PlaceholderContent } from "@/shared/components/placeholder-content";

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
        graphic={<Empty1Character />}
        title="두 명 이상의 일정이 필요해요.."
        description="링크를 공유하거나 일정을 등록해 보세요."
      />
    );
  }

  return (
    <PlaceholderContent
      graphic={<Empty1Character />}
      title="아직 겹치는 시간대가 없어요.."
      description="시간 범위를 넓히거나 팀원들을 기다려 보세요."
    />
  );
}
