import type { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import { InstallPromptView } from "@/shared/providers/install-prompt-provider/install-prompt-view";
import { useInstallPromptState } from "@/shared/providers/install-prompt-provider/use-install-prompt-state";

export function InstallPromptProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { close, install, isMounted, isOpen, mode } = useInstallPromptState(
    pathname === "/",
  );

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
