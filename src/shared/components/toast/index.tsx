import type { ReactNode } from "react";
import CheckCircleIcon from "@/assets/icons/check-circle.svg?react";
import { cn } from "@/shared/utils/cn";
import { useAutoHide } from "./use-auto-hide";

interface ToastProps {
  message: string;
  open: boolean;
  /** 자동 숨김 시간(ms). 기본 2500 */
  duration?: number;
  onClose: () => void;
  icon?: ReactNode;
}

function Toast({ message, open, duration = 2500, onClose, icon }: ToastProps) {
  const { visible, show } = useAutoHide(open, duration, onClose);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div
        className={cn(
          "flex items-center gap-2 rounded-full bg-black/80 px-5 py-3 shadow-lg transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        {icon ?? <CheckCircleIcon className="size-4 shrink-0" />}
        <span className="whitespace-nowrap text-b4 text-white">{message}</span>
      </div>
    </div>
  );
}

export { Toast };
export type { ToastProps };
