import { type PropsWithChildren, useEffect } from "react";
import { useLocation } from "react-router";
import { InstallPromptView } from "@/shared/providers/install-prompt-provider/install-prompt-view";
import { useInstallPromptState } from "@/shared/providers/install-prompt-provider/use-install-prompt-state";

interface InstallPromptProviderProps extends PropsWithChildren {
  /**
   * 시트가 화면 하단을 점유하는 동안 알린다. 업데이트 토스트가 같은 자리를
   * 쓰기 때문에, 겹치지 않도록 시트가 닫힐 때까지 미뤄두게 한다.
   */
  onVisibilityChange?: (isVisible: boolean) => void;
}

export function InstallPromptProvider({
  children,
  onVisibilityChange,
}: InstallPromptProviderProps) {
  const { pathname } = useLocation();
  const { close, install, isMounted, isOpen, mode } = useInstallPromptState(
    pathname === "/",
  );

  const isVisible = isMounted && mode !== "hidden";

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  return (
    <>
      {children}
      <InstallPromptView
        isMounted={isMounted}
        isOpen={isOpen}
        mode={mode}
        onClose={close}
        onInstall={() => {
          void install();
        }}
      />
    </>
  );
}
