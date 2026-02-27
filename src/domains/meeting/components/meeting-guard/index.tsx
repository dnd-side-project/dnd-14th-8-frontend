import { type ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MeetingJoinInvite } from "@/domains/meeting/components/meeting-join-invite";
import { useMeetingAccess } from "@/domains/meeting/hooks/use-meeting-access";

interface MeetingGuardProps {
  children: ReactNode;
}

export function MeetingGuard({ children }: MeetingGuardProps) {
  const { meetingId } = useParams<{ meetingId: string }>();

  // 서버 데이터 기준 참여 여부 확인
  const { isMember, hostName, isLoading } = useMeetingAccess(meetingId);

  // 처음 들어왔을 때 멤버가 아니라면(isMember: false) 초대장 보여주기
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    // 로딩이 끝나고 멤버가 아니라고 판별되면 초대장 노출
    if (!isLoading && !isMember) {
      setShowInvite(true);
    }
  }, [isLoading, isMember]);

  // '모임 참여하기' 버튼 클릭 시 실행
  const handleJoinClick = () => {
    // 단순히 초대장 상태만 끄면, children(메인 화면) 나타나기
    setShowInvite(false);
  };

  if (isLoading) return null;

  // 초대장 상태가 활성화되어 있으면 초대장 노출
  if (showInvite) {
    return <MeetingJoinInvite hostName={hostName} onJoin={handleJoinClick} />;
  }

  // 그 외에는 메인 화면 노출
  return <>{children}</>;
}
