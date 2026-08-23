import { Modal } from "@/shared/components/modal";

export interface HomeExitConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 서버에 참여 이력이 없어 최근 모임 목록으로 다시 찾아올 수 없는 사람에게만
 * 띄운다. 판별은 canReturnToMeeting이 맡는다.
 */
export function HomeExitConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: HomeExitConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="홈으로 나갈까요?"
      caption={
        "아직 참여 정보가 없어서 이 모임이 최근 모임 목록에 남지 않아요.\n초대 링크를 따로 보관해주세요."
      }
      primaryButton={{
        label: "홈으로 가기",
        color: "blue",
        onClick: onConfirm,
      }}
      secondaryButton={{
        label: "취소",
        color: "gray",
        onClick: onCancel,
      }}
    />
  );
}
