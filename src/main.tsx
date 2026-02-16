import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { ReactRouterProvider } from "@/shared/providers/react-router-provider";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ReactRouterProvider>
        <App />
      </ReactRouterProvider>
    </StrictMode>,
  );
}
