import { Modal } from "@/shared/components/modal";

interface RecentMeetingFlowDialogProps {
  hostName: string;
  isOpen: boolean;
  onClose: () => void;
  onGoToLocation: () => void;
  onGoToSchedule: () => void;
}

export function RecentMeetingFlowDialog({
  hostName,
  isOpen,
  onClose,
  onGoToLocation,
  onGoToSchedule,
}: RecentMeetingFlowDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="어디로 이동할까요?"
      caption={`${hostName}님의 모임에서 확인할 화면을 선택해주세요.`}
      primaryButton={{
        label: "중간지점 보기",
        color: "blue",
        onClick: onGoToLocation,
      }}
      secondaryButton={{
        label: "일정 조율 보기",
        color: "gray",
        onClick: onGoToSchedule,
      }}
    />
  );
}
