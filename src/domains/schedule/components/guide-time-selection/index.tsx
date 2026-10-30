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
        "textStyle_body5 inline-flex w-fit select-none items-center gap-1.5 text-fg-neutral-subtle",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-3 shrink-0 rounded-[3.43px] border transition-colors",
          checked && "border-stroke-brand-default bg-fill-brand-default",
          !checked && "border-stroke-neutral-subtle bg-fill-neutral-subtlest",
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
      <p className="textStyle_body4 text-fg-neutral-subtle">{description}</p>
      <div className="flex items-center gap-3">
        <GuideLegendItem checked={true}>{availableLabel}</GuideLegendItem>
        <GuideLegendItem checked={false}>{unavailableLabel}</GuideLegendItem>
      </div>
    </div>
  );
}
