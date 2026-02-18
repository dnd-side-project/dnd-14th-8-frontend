import { type HTMLAttributes, type ReactNode, useMemo } from "react";
import { Chip } from "@/shared/components/chip";
import {
  ChipButton,
  type ChipButtonProps,
} from "@/shared/components/chip-button";
import { CalendarIcon, TimeIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";
import { getScheduleDateSummary } from "./date-summary";

export interface ScheduleEditProps extends HTMLAttributes<HTMLDivElement> {
  dates: Date[];
  endTime: string;
  startTime: string;
  editButtonProps?: Omit<
    ChipButtonProps,
    "children" | "size" | "variant" | "onClick"
  >;
  editLabel?: ReactNode;
  onEdit?: () => void;
}

export function ScheduleEdit({
  className,
  dates,
  editButtonProps,
  editLabel = "수정",
  endTime,
  startTime,
  onEdit,
  ...props
}: ScheduleEditProps) {
  const {
    className: editButtonClassName,
    type,
    ...restEditButtonProps
  } = editButtonProps ?? {};

  const { label: dateLabel, overflow } = useMemo(
    () => getScheduleDateSummary(dates),
    [dates],
  );

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-k-100 bg-k-5 px-3 py-2",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2 text-b4">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap">
            <CalendarIcon
              aria-hidden
              className="size-5 shrink-0 translate-y-[0.5px] text-k-500"
            />
            <span className="text-k-900">{dateLabel}</span>
          </span>
          {overflow > 0 ? <Chip size="sm">+{overflow}</Chip> : null}
        </div>
        <span className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap">
          <TimeIcon aria-hidden className="size-5 shrink-0 text-k-500" />
          <span className="text-k-900">
            {startTime} - {endTime}
          </span>
        </span>
      </div>
      <ChipButton
        size="sm"
        type={type ?? "button"}
        variant="primary"
        className={editButtonClassName}
        onClick={onEdit}
        {...restEditButtonProps}
      >
        {editLabel}
      </ChipButton>
    </div>
  );
}
