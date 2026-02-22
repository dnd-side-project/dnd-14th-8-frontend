import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ConfirmModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  cancelLabel = "아니요",
  className,
  confirmLabel = "네",
  description,
  title,
  onCancel,
  onConfirm,
  ...props
}: ConfirmModalProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 flex items-center justify-center bg-k-900/60 px-5",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-[335px] rounded-2xl bg-k-5 p-5">
        <h2 className="text-center text-k-900 text-t1">{title}</h2>
        {description ? (
          <p className="mt-1 text-center text-b4 text-k-500">{description}</p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-k-100 text-k-900 text-t2 transition-colors enabled:cursor-pointer enabled:active:bg-k-300 enabled:hover:bg-k-200 disabled:cursor-not-allowed"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary-main text-k-5 text-t2 transition-colors enabled:cursor-pointer enabled:active:bg-p-500 enabled:hover:bg-p-450 disabled:cursor-not-allowed"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
