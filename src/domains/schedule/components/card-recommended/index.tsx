import { Icon } from "@moyeorak/design-system";
import type { HTMLAttributes, MouseEvent } from "react";
import { useId, useState } from "react";
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
  const parts = scheduleDate.split("-"); // ["2026", "02", "28"]
  const month = Number(parts[1]);
  const day = Number(parts[2]);
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
        "w-full rounded-[10px] border border-stroke-neutral-subtle bg-fill-neutral-subtlest",
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
        <span className="textStyle_body3 w-7 shrink-0 text-fg-brand-default">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="textStyle_title3 truncate text-fg-neutral-stronger">
            {dateLabel}
          </p>
          <p className="textStyle_title3 truncate text-fg-neutral-stronger">
            {timeLabel}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <p className="textStyle_body1 inline-flex items-center gap-0.5">
            <Icon type="member" size="sm" variant="brand" />
            <span className="textStyle_body4">
              <span className="text-fg-brand-default">{voteCount}</span>
              <span className="text-fg-neutral-default">
                /{participantCount}
              </span>
            </span>
          </p>
          <Icon
            type="chevron_down"
            size="sm"
            variant="default"
            className={cn(
              "transition-transform duration-200 ease-out",
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
              isExpanded && "border-stroke-neutral-subtle border-t",
            )}
          >
            <div>
              <p className="textStyle_body4 mb-2 inline-flex items-center text-fg-neutral-stronger">
                <Icon type="valid" size="sm" />
                참여가능({availableCount})
              </p>
              <p className="textStyle_body4 rounded-sm bg-fill-brand-subtle px-4 py-3 text-fg-brand-default">
                {availableNames}
              </p>
            </div>
            <div>
              <p className="textStyle_body4 mb-2 inline-flex items-center text-fg-neutral-default">
                <Icon type="invalid" size="sm" />
                참여불가({unavailableCount})
              </p>
              <p className="textStyle_body4 rounded-sm bg-fill-neutral-subtler px-4 py-3 text-fg-neutral-default">
                {unavailableNames}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
