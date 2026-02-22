import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { cn } from "@/shared/utils/cn";

const modalButtonStyles = {
  gray: "h-12 bg-k-50 text-k-750 text-b1 enabled:active:bg-k-200 enabled:hover:bg-k-100",
  blue: "h-12 bg-primary-main text-b1 text-k-10 enabled:active:bg-p-500 enabled:hover:bg-p-450",
};

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  caption?: string;
  primaryButton: {
    label: string;
    onClick: () => void;
    color: "blue" | "gray";
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    color: "blue" | "gray";
  };
}

export function Modal({
  isOpen,
  onClose,
  title,
  caption,
  primaryButton,
  secondaryButton,
}: ModalProps) {
  const modalRef = useOutsideClick<HTMLDivElement>(onClose ?? (() => {}));
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-9">
      <div
        ref={modalRef}
        className="w-full max-w-[303px] rounded-2xl bg-k-5 p-4"
      >
        <div className="mb-6 text-center">
          {title && <h3 className="mb-2 text-k-800 text-t1">{title}</h3>}
          {caption && <p className="text-b4 text-k-500">{caption}</p>}
        </div>

        <div
          className={cn("flex", {
            "flex-row gap-[11px]": secondaryButton,
            "flex-col": !secondaryButton,
          })}
        >
          {secondaryButton && (
            <button
              type="button"
              onClick={secondaryButton.onClick}
              className={`flex-1 rounded-md transition-all ${modalButtonStyles[secondaryButton.color]}`}
            >
              {secondaryButton.label}
            </button>
          )}

          <button
            type="button"
            onClick={primaryButton.onClick}
            className={cn(
              "rounded-md transition-all",
              secondaryButton ? "flex-1" : "w-full",
              modalButtonStyles[primaryButton.color],
            )}
          >
            {primaryButton.label}
          </button>
        </div>
      </div>
    </div>
  );
}
