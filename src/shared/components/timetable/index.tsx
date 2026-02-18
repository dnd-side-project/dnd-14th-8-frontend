import React, { useMemo } from "react";
import { TimetableSlot } from "@/shared/components/timetable-slot";
import { cn } from "@/shared/utils/cn";
import { useTimetableDragSelection } from "./use-timetable-drag-selection";

export interface TimetableProps {
  dates: Date[];
  startTime?: number;
  endTime?: number;
  className?: string;
  selected?: Date[];
  onSelect?: (dates: Date[]) => void;
  disabled?: boolean;
  occupancy?: Record<string, number>;
}

const getOpacityMap = (occupancy: Record<string, number>) => {
  const uniqueCounts = Array.from(new Set(Object.values(occupancy)))
    .filter((count) => count > 0)
    .sort((a, b) => a - b);

  const N = uniqueCounts.length;
  const map: Record<number, number> = {};

  uniqueCounts.forEach((count, index) => {
    map[count] = (index + 1) / N;
  });

  return map;
};

export function Timetable({
  dates,
  startTime = 9,
  endTime = 24,
  className,
  selected = [],
  onSelect,
  disabled = false,
  occupancy = {},
}: TimetableProps) {
  const totalSlots = (endTime - startTime) * 2;

  const { selectedSlots, handleMouseDown, handleMouseEnter } =
    useTimetableDragSelection({
      dates,
      startTime,
      selected,
      onSelect,
    });

  const opacityMap = useMemo(() => getOpacityMap(occupancy), [occupancy]);

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date);
  };

  const getFormattedDate = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}.${dd}`;
  };

  const gridTemplateColumns = useMemo(() => {
    if (dates.length <= 4) {
      return `20px repeat(${dates.length}, 1fr)`;
    }
    return `20px repeat(${dates.length}, 62px)`;
  }, [dates.length]);

  return (
    <div
      className={cn("relative w-full select-none overflow-x-auto", className)}
    >
      <div
        className="mb-3 grid min-w-max gap-1"
        style={{ gridTemplateColumns }}
      >
        <div className="sticky top-0 left-0 z-20 -mr-1 h-[58px] w-5 bg-k-5" />
        {dates.map((date) => (
          <div
            key={date.toISOString()}
            className="sticky top-0 z-20 flex h-[54px] flex-col items-center justify-center bg-k-5"
          >
            <span className="text-b3 text-k-500">{getDayName(date)}</span>
            <span className="text-b3 text-k-700">{getFormattedDate(date)}</span>
          </div>
        ))}

        {Array.from({ length: totalSlots }).map((_, slotIdx) => {
          const isHourStart = slotIdx % 2 === 0;
          const currentHour = startTime + Math.floor(slotIdx / 2);
          const currentMinutes = slotIdx % 2 !== 0 ? 30 : 0;
          const isLastSlot = slotIdx === totalSlots - 1;

          return (
            <React.Fragment key={`row-${currentHour}-${currentMinutes}}`}>
              <div className="sticky left-0 z-20 -mr-2 h-[40px] w-5 bg-k-5">
                {isHourStart && (
                  <span className="absolute -top-2.5 left-0 z-30 w-full text-b3 text-k-500">
                    {String(currentHour)}
                  </span>
                )}

                {isLastSlot && (
                  <span className="absolute -bottom-2.5 left-0 z-30 w-full text-b3 text-k-500">
                    {String(endTime)}
                  </span>
                )}
              </div>

              {dates.map((date, dateIdx) => {
                const slotDate = new Date(date);
                slotDate.setHours(currentHour, currentMinutes, 0, 0);
                const timeKey = slotDate.getTime().toString();

                const isSelected = selectedSlots.has(timeKey);
                const userCount = occupancy[timeKey] || 0;
                const opacity = opacityMap[userCount] || 0;
                return (
                  <TimetableSlot
                    key={timeKey}
                    isSelected={isSelected}
                    isDisabled={disabled}
                    opacity={opacity}
                    onMouseDown={() =>
                      !disabled && handleMouseDown(dateIdx, slotIdx)
                    }
                    onMouseEnter={() =>
                      !disabled && handleMouseEnter(dateIdx, slotIdx)
                    }
                    className={cn("touch-none", disabled && "cursor-default")}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
