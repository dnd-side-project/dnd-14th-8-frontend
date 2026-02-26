import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import { toast } from "@/shared/components/toast";
import { ShareSheetView } from "@/shared/providers/share-sheet-provider/share-sheet-view";
import { useShareSheetState } from "@/shared/providers/share-sheet-provider/use-share-sheet-state";
import { copyTextToClipboard } from "@/shared/utils/clipboard";
import { openKakaoAppScheme } from "@/shared/utils/kakao";

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
      console.error("클립보드 복사에 실패했어요");
    }

    toast.success("클립보드에 복사되었어요");
    close();
  }, [close]);

  const handleKakaoShare = useCallback(() => {
    const opened = openKakaoAppScheme(window.location.href);

    if (!opened) {
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
