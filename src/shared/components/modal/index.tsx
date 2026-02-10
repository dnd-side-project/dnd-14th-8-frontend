import { type ReactNode, useEffect } from "react";
import CloseIcon from "@/assets/icons/close.svg?react";
import { cn } from "@/shared/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /** 우측 상단 X 닫기 버튼 (공유하기 모달 등) */
  showClose?: boolean;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

function Modal({
  open,
  onClose,
  title,
  description,
  showClose = false,
  children,
  actions,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const centered = !showClose;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/40"
        tabIndex={-1}
        aria-label="모달 닫기"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 mx-4 w-full max-w-xs rounded-[20px] bg-white p-6",
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || showClose) && (
          <div
            className={cn(
              "flex items-center",
              centered ? "justify-center pt-2" : "justify-between",
            )}
          >
            {title && (
              <h2
                className={cn("text-k-900 text-t1", centered && "text-center")}
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 cursor-pointer items-center justify-center text-k-500"
                aria-label="닫기"
              >
                <CloseIcon className="size-5" />
              </button>
            )}
          </div>
        )}
        {description && (
          <p
            className={cn("mt-2 text-b5 text-k-500", centered && "text-center")}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        {actions && <div className="mt-6 flex gap-3">{actions}</div>}
      </div>
    </div>
  );
}

export { Modal };
export type { ModalProps };
