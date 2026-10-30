import type { PropsWithChildren } from "react";
import { Toaster } from "@/shared/components/toast";

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
