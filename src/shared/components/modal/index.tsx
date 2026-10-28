import { Button } from "@moyeorak/design-system";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { cn } from "@/shared/utils/cn";

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
          {title && <h3 className="mt-3 mb-2 text-k-800 text-t1">{title}</h3>}
          {caption && (
            <p className="whitespace-pre-wrap text-b4 text-k-500">{caption}</p>
          )}
        </div>

        <div
          className={cn("flex", {
            "flex-row gap-[11px]": secondaryButton,
            "flex-col": !secondaryButton,
          })}
        >
          {secondaryButton && (
            <Button
              size="lg"
              type="button"
              onClick={secondaryButton.onClick}
              variant={secondaryButton.color === "blue" ? "brand" : "outline"}
              className="flex-1 focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2"
            >
              {secondaryButton.label}
            </Button>
          )}

          <Button
            size="lg"
            type="button"
            onClick={primaryButton.onClick}
            variant={primaryButton.color === "blue" ? "brand" : "outline"}
            className={cn(
              "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
              secondaryButton ? "flex-1" : "w-full",
            )}
          >
            {primaryButton.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
