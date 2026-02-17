import { cn } from "@/shared/utils/cn";

export interface TimetableSlotProps {
  isSelected?: boolean;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

export function TimetableSlot({
  isSelected,
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
      className={cn(
        "h-10 w-15 rounded-md border transition-colors",
        isSelected
          ? "border-primary-main bg-primary-main"
          : "border-k-50 bg-k-10",
        className,
      )}
      aria-pressed={isSelected}
    />
  );
}
