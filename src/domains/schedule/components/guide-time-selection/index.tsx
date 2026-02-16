import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface GuideLegendItemProps extends HTMLAttributes<HTMLSpanElement> {
  checked?: boolean;
  children: ReactNode;
}

export interface GuideTimeSelectionProps
  extends HTMLAttributes<HTMLDivElement> {
  availableLabel?: ReactNode;
  description?: ReactNode;
  unavailableLabel?: ReactNode;
}

function GuideLegendItem({
  checked = false,
  children,
  className,
  ...props
}: GuideLegendItemProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit select-none items-center gap-1.5 text-b5 text-k-500",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-3 shrink-0 rounded-[3.43px] border transition-colors",
          checked && "border-primary-main bg-primary-main",
          !checked && "border-k-100 bg-k-10",
        )}
      />
      {children}
    </span>
  );
}

export function GuideTimeSelection({
  availableLabel = "가능",
  className,
  description = "클릭하거나 쓸어내려 가능 시간대를 지정해보세요",
  unavailableLabel = "불가",
  ...props
}: GuideTimeSelectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 bg-transparent",
        className,
      )}
      data-slot="guide-time-selection"
      {...props}
    >
      <p className="text-b4 text-k-600">{description}</p>
      <div className="flex items-center gap-3">
        <GuideLegendItem checked={true}>{availableLabel}</GuideLegendItem>
        <GuideLegendItem checked={false}>{unavailableLabel}</GuideLegendItem>
      </div>
    </div>
  );
}
