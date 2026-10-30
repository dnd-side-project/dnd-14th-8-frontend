import { Modal } from "@moyeorak/design-system";
import { useMemo, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router";
import { useConfirmSchedulePoll } from "@/domains/schedule/hooks/use-confirm-schedule-poll";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { normalizeScheduleVoteId } from "@/domains/schedule/utils/schedule-vote";
import { ScheduleMainView } from "@/domains/schedule/views/schedule-main-view";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { toast } from "@/shared/components/toast";

export function ScheduleMainPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { meetingId } = useParams() as { meetingId: string };

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { mutate: confirmSchedule } = useConfirmSchedulePoll();

  const myParticipantQuery = useGetMyParticipant({ meetingId });
  const hasExistingVote =
    normalizeScheduleVoteId(myParticipantQuery.data?.scheduleVoteId) !==
    undefined;
  const isHost = !!myParticipantQuery.data?.isHost;

  const tab = useMemo(
    () => (searchParams.get("tab") === "optimal" ? "optimal" : "vote"),
    [searchParams],
  );

  const handleTabChange = (nextTab: "optimal" | "vote") => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", nextTab);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleConfirmGoToLocation = () => {
    confirmSchedule(
      { meetingId },
      {
        onSuccess: () => {
          setIsLocationModalOpen(false);
          navigate(`/meetings/${meetingId}/location/stations`); // 장소 메인 화면으로 이동
        },
        onError: () => {
          toast.error("이동하지 못했어요. 다시 시도해주세요");
        },
      },
    );
  };

  return (
    <MobileLayout>
      <ScheduleMainView
        meetingId={meetingId}
        tab={tab}
        hasExistingVote={hasExistingVote}
        isHost={isHost}
        onVoteAction={() => navigate(`/meetings/${meetingId}/schedule/votes`)}
        onEditSchedule={() => navigate("edit/dates")}
        onParticipantEdit={() =>
          navigate(`/meetings/${meetingId}/schedule/edit/participants`)
        }
        onGoToLocation={() => setIsLocationModalOpen(true)}
        onTabChange={handleTabChange}
      />
      <Modal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        title="장소 정하기로 이동할까요?"
        body="이동 후 일정 추가 및 수정이 불가능해요"
        mainLabel="이동하기"
        onMain={handleConfirmGoToLocation}
        alternativeLabel="취소"
        onAlternative={() => setIsLocationModalOpen(false)}
      />
      <Outlet />
    </MobileLayout>
  );
}
