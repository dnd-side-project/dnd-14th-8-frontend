import { Button, Icon } from "@moyeorak/design-system";
import { parseISO } from "date-fns";
import { useMemo } from "react";
import { useMeetingAccess } from "@/domains/meeting/hooks/use-meeting-access";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { getScheduleDateSummary } from "@/domains/schedule/utils/date-summary";
import { cn } from "@/shared/utils/cn";

/** "09:00" 또는 "09:00:00"을 "9:00"으로 줄인다. */
function formatScheduleTime(value: string) {
  const [hour, minute = "00"] = value.split(":");
  return `${Number(hour)}:${minute}`;
}

export interface ScheduleMainSummaryContentProps {
  canEditRange: boolean;
  className?: string;
  dates: Date[];
  endTime: string;
  hostName: string;
  startTime: string;
  votedParticipantCount: number;
  onEditSchedule: () => void;
}

/**
 * 일정 메인 화면 상단 요약 영역
 *
 * Figma: HomeHeader
 */
export function ScheduleMainSummaryContent({
  canEditRange,
  className,
  dates,
  endTime,
  hostName,
  startTime,
  votedParticipantCount,
  onEditSchedule,
}: ScheduleMainSummaryContentProps) {
  const { label: dateLabel, overflow } = useMemo(
    () => getScheduleDateSummary(dates),
    [dates],
  );

  return (
    <section
      className={cn("w-full bg-bg-neutral-strongest px-5 pt-6 pb-5", className)}
    >
      <p className="textStyle_body4 text-fg-brand-default">
        {hostName}님의 모임
      </p>
      <h1 className="textStyle_title1 mt-1 text-fg-neutral-faintest">
        현재 {votedParticipantCount}명이 참여했어요
      </h1>
      <div className="mt-3 flex min-h-8 items-center justify-between gap-2">
        <dl className="textStyle_body5 flex min-w-0 items-center gap-3 text-fg-neutral-subtler">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <dt className="sr-only">날짜</dt>
            <Icon type="calendar" size="xs" variant="weak" />
            <dd>
              {dateLabel}
              {overflow > 0 && (
                <span className="ml-1 text-fg-neutral-subtle">+{overflow}</span>
              )}
            </dd>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <dt className="sr-only">시간</dt>
            <Icon type="clock" size="xs" variant="weak" />
            <dd>
              {formatScheduleTime(startTime)}-{formatScheduleTime(endTime)}
            </dd>
          </div>
        </dl>
        {canEditRange && (
          <Button
            variant="brand"
            size="sm"
            className="shrink-0"
            onClick={onEditSchedule}
          >
            시간표 수정
          </Button>
        )}
      </div>
    </section>
  );
}

export interface ScheduleMainSummaryProps {
  canEditRange: boolean;
  className?: string;
  meetingId: string;
  onEditSchedule: () => void;
}

export function ScheduleMainSummary({
  canEditRange,
  className,
  meetingId,
  onEditSchedule,
}: ScheduleMainSummaryProps) {
  const { data } = useGetMeetingSchedules({ meetingId });
  const { hostName, isLoading } = useMeetingAccess(meetingId);

  const dates = useMemo(
    () => data?.dateOptions.map((date) => parseISO(date)) ?? [],
    [data?.dateOptions],
  );

  if (!data || isLoading) return null;

  return (
    <ScheduleMainSummaryContent
      canEditRange={canEditRange}
      className={className}
      dates={dates}
      endTime={data.endTime}
      hostName={hostName}
      startTime={data.startTime}
      votedParticipantCount={data.votedParticipantCount}
      onEditSchedule={onEditSchedule}
    />
  );
}
