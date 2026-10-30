import "@/index.css";
import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CustomRoutes } from "@/routes";
import { BackendConnectionProvider } from "@/shared/providers/backend-connection-provider";
import { InstallPromptProvider } from "@/shared/providers/install-prompt-provider";
import { ReactRouterProvider } from "@/shared/providers/react-router-provider";
import { ShareSheetProvider } from "@/shared/providers/share-sheet-provider";
import { TanstackQueryProvider } from "@/shared/providers/tanstack-query-provider";
import { ToastProvider } from "@/shared/providers/toast-provider";
import {
  openUpdatePrompt,
  UpdatePromptProvider,
} from "@/shared/providers/update-prompt-provider";
import { createUpdateNotifier } from "@/shared/utils/service-worker-update";

const updateNotifier = createUpdateNotifier({
  showPrompt: openUpdatePrompt,
  updateSW: (reloadPage) => {
    void updateSW(reloadPage);
  },
});

const updateSW = registerSW({
  onNeedRefresh() {
    updateNotifier.notify();
  },
});

// 렌더마다 새 함수가 되면 구독 이펙트가 매번 다시 돈다.
const handleInstallPromptVisibility = (isVisible: boolean) => {
  updateNotifier.setBlocked(isVisible);
};

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BackendConnectionProvider>
        <TanstackQueryProvider>
          <ReactRouterProvider>
            <ToastProvider>
              <UpdatePromptProvider onRefresh={updateNotifier.applyUpdate}>
                <ShareSheetProvider>
                  <InstallPromptProvider
                    onVisibilityChange={handleInstallPromptVisibility}
                  >
                    <CustomRoutes />
                  </InstallPromptProvider>
                </ShareSheetProvider>
              </UpdatePromptProvider>
            </ToastProvider>
          </ReactRouterProvider>
        </TanstackQueryProvider>
      </BackendConnectionProvider>
    </StrictMode>,
  );
}
