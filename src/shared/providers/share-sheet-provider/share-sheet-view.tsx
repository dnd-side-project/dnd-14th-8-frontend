import { Icon, IconButton } from "@moyeorak/design-system";
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
          "absolute inset-0 z-0 bg-overlay-neutral-default transition-opacity duration-200 ease-out",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        type="button"
      />

      <section
        aria-label="공유하기"
        aria-modal="true"
        className={cn(
          "absolute right-0 bottom-0 left-0 z-10 mx-auto w-full overflow-hidden rounded-t-[20px] bg-bg-neutral-default transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:max-w-[375px]",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
      >
        <div className="flex items-center border-stroke-neutral-subtler border-b px-5 py-3">
          <h2 className="textStyle_title1 text-fg-neutral-stronger">
            공유하기
          </h2>
          <IconButton
            size="sm"
            variant="clear"
            className="ml-auto"
            aria-label="닫기"
            onClick={onClose}
          >
            <Icon type="x_circle" size="md" />
          </IconButton>
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
