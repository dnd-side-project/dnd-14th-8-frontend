import type { HTMLAttributes, MouseEvent } from "react";
import { useId, useState } from "react";
import {
  AvailableIcon,
  ChevronDownIcon,
  MemberIcon,
  UnavailableIcon,
} from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface CardRecommendedProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
  scheduleDate: string;
  scheduleDayOfWeek: string;
  startTime: string;
  endTime: string;
  voteCount: number;
  participantCount: number;
  availableParticipantNames: string[];
  unavailableParticipantNames: string[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

function formatDateLabel(scheduleDate: string, scheduleDayOfWeek: string) {
  const [_, month, day] = scheduleDate.split("-");
  return `${month}월 ${day}일 ${scheduleDayOfWeek}`;
}

export function CardRecommended({
  index = 1,
  scheduleDate,
  scheduleDayOfWeek,
  startTime,
  endTime,
  voteCount,
  participantCount,
  availableParticipantNames,
  unavailableParticipantNames,
  className,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  ...props
}: CardRecommendedProps) {
  const detailsId = useId();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expanded ?? internalExpanded;

  const dateLabel = formatDateLabel(scheduleDate, scheduleDayOfWeek);
  const timeLabel = `${startTime} ~ ${endTime}`;
  const availableCount = availableParticipantNames.length;
  const unavailableCount = unavailableParticipantNames.length;
  const availableNames = availableParticipantNames.join(", ") || "없음";
  const unavailableNames = unavailableParticipantNames.join(", ") || "없음";

  const handleToggleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.defaultPrevented) {
      return;
    }

    const nextExpanded = !isExpanded;
    setInternalExpanded(nextExpanded);
    onExpandedChange?.(nextExpanded);
  };

  return (
    <div
      className={cn(
        "w-full rounded-[10px] border border-k-100 bg-k-10",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-controls={detailsId}
        aria-expanded={isExpanded}
        onClick={handleToggleClick}
        className="flex w-full items-center bg-transparent p-4 text-left enabled:cursor-pointer disabled:cursor-default"
      >
        <span className="w-7 shrink-0 text-b3 text-primary-main">{index}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-k-900 text-t2">{dateLabel}</p>
          <p className="truncate text-k-900 text-t2">{timeLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <p className="inline-flex items-center gap-0.5 text-b1">
            <MemberIcon className="size-5 shrink-0 text-primary-main" />
            <span className="text-b4">
              <span className="text-primary-main">{voteCount}</span>
              <span className="text-k-700">/{participantCount}</span>
            </span>
          </p>
          <ChevronDownIcon
            className={cn(
              "size-5 shrink-0 text-k-500 transition-transform duration-200 ease-out",
              isExpanded ? "rotate-180" : "rotate-0",
            )}
          />
        </div>
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
          isExpanded && "grid-rows-[1fr]",
          !isExpanded && "grid-rows-[0fr]",
        )}
      >
        <div aria-hidden={!isExpanded} className="min-h-0 px-4" id={detailsId}>
          <div
            className={cn(
              "flex flex-col gap-y-5 pt-3 pb-4",
              isExpanded && "border-k-100 border-t",
            )}
          >
            <div>
              <p className="mb-2 inline-flex items-center text-b4 text-k-900">
                <AvailableIcon className="size-5 shrink-0 text-primary-main" />
                참여가능({availableCount})
              </p>
              <p className="rounded-sm bg-p-50 px-4 py-3 text-b4 text-primary-main">
                {availableNames}
              </p>
            </div>
            <div>
              <p className="mb-2 inline-flex items-center text-b4 text-k-700">
                <UnavailableIcon className="size-5 shrink-0 text-k-700" />
                참여불가({unavailableCount})
              </p>
              <p className="rounded-sm bg-k-50 px-4 py-3 text-b4 text-k-700">
                {unavailableNames}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
