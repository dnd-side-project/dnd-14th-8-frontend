import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon } from "@/shared/components/icons";
import {
  ShareButton,
  type ShareChannel,
} from "@/shared/components/share-button";
import { cn } from "@/shared/utils/cn";

interface ShareSheetViewProps {
  isMounted: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCopyShare: () => void;
  onKakaoShare: () => void;
  onNativeShare: () => void;
}

interface ShareAction {
  channel: ShareChannel;
  onClick: () => void;
}

export function ShareSheetView({
  isMounted,
  isOpen,
  onClose,
  onCopyShare,
  onKakaoShare,
  onNativeShare,
}: ShareSheetViewProps) {
  if (!isMounted) {
    return null;
  }

  const shares: ShareAction[] = [
    {
      channel: "kakaotalk",
      onClick: onKakaoShare,
    },
    {
      channel: "link",
      onClick: onCopyShare,
    },
    {
      channel: "more",
      onClick: onNativeShare,
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-100",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        aria-label="공유 시트 배경 닫기"
        className={cn(
          "absolute inset-0 z-0 bg-k-900/70 transition-opacity duration-200 ease-out",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        type="button"
      />

      <section
        aria-label="공유하기"
        aria-modal="true"
        className={cn(
          "absolute right-0 bottom-0 left-0 z-10 mx-auto w-full overflow-hidden rounded-t-[20px] bg-k-5 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:max-w-[375px]",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
      >
        <div className="flex items-center border-k-50 border-b px-5 py-3">
          <h2 className="text-k-900 text-t1">공유하기</h2>
          <IconButton
            icon={CloseIcon}
            size="lg"
            background="circle"
            backgroundSize="sm"
            iconSize="sm"
            variant="neutral"
            className="ml-auto"
            aria-label="닫기"
            onClick={onClose}
          />
        </div>

        <div className="flex items-start justify-center gap-4 px-5 pt-3.5 pb-7">
          {shares.map(({ channel, onClick }) => (
            <ShareButton key={channel} channel={channel} onClick={onClick} />
          ))}
        </div>
      </section>
    </div>
  );
}
