import type { PropsWithChildren } from "react";
import { Toast } from "@/shared/components/toast";

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Toast position="bottom-center" />
    </>
  );
}
