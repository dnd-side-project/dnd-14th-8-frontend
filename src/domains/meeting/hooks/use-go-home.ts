import { useState } from "react";
import { useNavigate } from "react-router";
import { canReturnToMeeting } from "@/domains/meeting/utils/meeting-return";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";

/**
 * 홈으로 나가는 동작을 배선한다. 다시 돌아올 수 있는 사람은 바로 보내고,
 * 그렇지 않은 사람에게만 확인 모달을 띄운다. 판단은 canReturnToMeeting에 있다.
 *
 * 두 메인 화면 모두 이미 useGetMyParticipant를 호출하므로 쿼리 캐시를
 * 공유한다. 추가 요청은 발생하지 않는다.
 */
export function useGoHome({ meetingId }: { meetingId: string }) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { data: myParticipant } = useGetMyParticipant({ meetingId });

  const goHome = () => {
    if (canReturnToMeeting(myParticipant)) {
      navigate("/");
      return;
    }

    setIsConfirmOpen(true);
  };

  return {
    cancelGoHome: () => setIsConfirmOpen(false),
    confirmGoHome: () => navigate("/"),
    goHome,
    isConfirmOpen,
  };
}
