import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CustomRoutes } from "@/routes";
import { ReactRouterProvider } from "@/shared/providers/react-router-provider";
import { TanstackQueryProvider } from "@/shared/providers/tanstack-query-provider";
import { ToastProvider } from "@/shared/providers/toast-provider";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <TanstackQueryProvider>
        <ReactRouterProvider>
          <ToastProvider>
            <CustomRoutes />
          </ToastProvider>
        </ReactRouterProvider>
      </TanstackQueryProvider>
    </StrictMode>,
  );
}
