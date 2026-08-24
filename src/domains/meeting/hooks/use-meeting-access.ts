import { hasVoteId } from "@/domains/meeting/utils/vote-id";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { useListParticipants } from "@/domains/schedule/hooks/use-list-participants";

export function useMeetingAccess(meetingId?: string) {
  // 1. 내 참여 정보 조회
  const {
    data: myInfo,
    isLoading: isMeLoading,
    refetch: refetchMe,
  } = useGetMyParticipant({ meetingId: meetingId ?? "" });

  // 2. 전체 팀원 목록 조회
  const { data: participantsData, isLoading: isParticipantsLoading } =
    useListParticipants({ meetingId: meetingId ?? "" });

  // 팀장 이름 찾기
  const hostName =
    participantsData?.participants?.find((p) => p.isHost)?.name ?? "팀장";

  // 멤버 여부 판단
  const isMember = !!(
    myInfo &&
    (myInfo.isHost ||
      hasVoteId(myInfo.scheduleVoteId) ||
      hasVoteId(myInfo.locationVoteId))
  );

  return {
    isMember,
    hostName,
    isLoading: isMeLoading || isParticipantsLoading,
    refetchMe,
  };
}
