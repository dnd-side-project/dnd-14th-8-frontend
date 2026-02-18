import { cn } from "@/shared/utils/cn";

export interface TimetableSlotProps {
  isSelected?: boolean;
  isDisabled?: boolean;
  opacity?: number;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

export function TimetableSlot({
  isSelected,
  isDisabled,
  opacity = 0,
  onClick,
  onMouseDown,
  onMouseEnter,
  className,
}: TimetableSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      disabled={isDisabled}
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
