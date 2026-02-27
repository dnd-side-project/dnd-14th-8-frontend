import { useMemo, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router";
import { useConfirmSchedulePoll } from "@/domains/schedule/hooks/use-confirm-schedule-poll";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { normalizeScheduleVoteId } from "@/domains/schedule/utils/schedule-vote";
import { ScheduleMainView } from "@/domains/schedule/views/schedule-main-view";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { Modal } from "@/shared/components/modal";
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
  const isHost = myParticipantQuery.data?.isHost !== undefined;

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
          toast.error("일정을 확정하는 중 오류가 발생했어요");
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
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="장소 정하기로 이동할까요?"
        caption="이동 후에는 일정을 추가하거나 수정할 수 없어요."
        primaryButton={{
          label: "이동하기",
          color: "blue",
          onClick: handleConfirmGoToLocation,
        }}
        secondaryButton={{
          label: "취소",
          color: "gray",
          onClick: () => setIsLocationModalOpen(false),
        }}
      />
      <Outlet />
    </MobileLayout>
  );
}
