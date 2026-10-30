import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import { toast } from "@/shared/components/toast";
import { canOpenKakaoShare } from "@/shared/providers/share-sheet-provider/kakao-share-availability";
import { ShareSheetView } from "@/shared/providers/share-sheet-provider/share-sheet-view";
import { useShareSheetState } from "@/shared/providers/share-sheet-provider/use-share-sheet-state";
import { copyTextToClipboard } from "@/shared/utils/clipboard";
import { shareKakao } from "@/shared/utils/kakao";

interface ShareSheetContextValue {
  share: () => void;
}

export const ShareSheetContext = createContext<ShareSheetContextValue | null>(
  null,
);

export function ShareSheetProvider({ children }: PropsWithChildren) {
  const { close, isMounted, isOpen, share } = useShareSheetState();

  const handleCopyShare = useCallback(async () => {
    const copied = await copyTextToClipboard(window.location.href);
    if (!copied) {
      toast.error("링크를 복사하지 못했어요. 다시 시도해주세요");
      return;
    }

    toast.success("링크가 복사되었어요");
    close();
  }, [close]);

  const handleKakaoShare = useCallback(() => {
    if (!canOpenKakaoShare(navigator.userAgent)) {
      toast.error("PC에서는 링크 복사로 공유해주세요");
      close();
      // void handleCopyShare();
      return;
    }

    const shared = shareKakao(window.location.href);
    if (!shared) {
      void handleCopyShare();
      return;
    }

    close();
  }, [close, handleCopyShare]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        close();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await handleCopyShare();
  }, [close, handleCopyShare]);

  const context = useMemo(() => ({ share }), [share]);

  return (
    <ShareSheetContext.Provider value={context}>
      {children}
      <ShareSheetView
        isMounted={isMounted}
        isOpen={isOpen}
        onClose={close}
        onKakaoShare={handleKakaoShare}
        onCopyShare={handleCopyShare}
        onNativeShare={handleNativeShare}
      />
    </ShareSheetContext.Provider>
  );
}
