import type { PointerEvent } from "react";
import { cn } from "@/shared/utils/cn";

export interface TimetableSlotProps {
  isSelected?: boolean;
  isDisabled?: boolean;
  opacity?: number;
  onClick?: () => void;
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
  className?: string;
  dataDateIdx?: number;
  dataSlotIdx?: number;
}

export function TimetableSlot({
  isSelected,
  isDisabled,
  opacity = 0,
  onClick,
  onPointerDown,
  className,
  dataDateIdx,
  dataSlotIdx,
}: TimetableSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      disabled={isDisabled}
      data-date-idx={dataDateIdx}
      data-slot-idx={dataSlotIdx}
      className={cn(
        "h-10 w-full rounded-md border transition-all",
        "border-k-50 bg-k-10",
        isDisabled ? "cursor-default" : "cursor-pointer",
        isSelected && "border-primary-main bg-primary-main",
        className,
      )}
      style={{
        backgroundColor:
          !isSelected && opacity > 0
            ? `rgba(65, 129, 255, ${opacity})`
            : undefined,
        borderColor:
          !isSelected && opacity === 1 ? "rgba(65, 129, 255, 1)" : undefined,
      }}
      aria-pressed={isSelected}
    />
  );
}
