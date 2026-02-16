import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CustomRoutes } from "@/routes";
import { ReactRouterProvider } from "@/shared/providers/react-router-provider";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ReactRouterProvider>
        <CustomRoutes />
      </ReactRouterProvider>
    </StrictMode>,
  );
}
