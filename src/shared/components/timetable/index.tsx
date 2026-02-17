import React from "react";
import { TimetableSlot } from "@/shared/components/timetable-slot";
import { cn } from "@/shared/utils/cn";
import { useTimetableDragSelection } from "./use-timetable-drag-selection";

export interface TimetableProps {
  dates: Date[];
  startTime?: number;
  endTime?: number;
  className?: string;
}

export function Timetable({
  dates,
  startTime = 9,
  endTime = 24,
  className,
}: TimetableProps) {
  const totalSlots = (endTime - startTime) * 2;

  const { selectedSlots, handleMouseDown, handleMouseEnter } =
    useTimetableDragSelection({
      dates,
      startTime,
    });

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date);
  };

  const getFormattedDate = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}.${dd}`;
  };

  return (
    <div
      className={cn("relative w-full select-none overflow-hidden", className)}
    >
      <div className="overflow-auto">
        <div
          className="grid min-w-max gap-1"
          style={{
            gridTemplateColumns: `40px repeat(${dates.length}, 60px)`,
          }}
        >
          <div className="sticky top-0 left-0 z-20 h-[58px] w-10 bg-k-5" />
          {dates.map((date) => (
            <div
              key={date.toISOString()}
              className="sticky top-0 z-20 flex h-[58px] flex-col items-center justify-center bg-k-5"
            >
              <span className="text-b3 text-k-500">{getDayName(date)}</span>
              <span className="text-b3 text-k-700">
                {getFormattedDate(date)}
              </span>
            </div>
          ))}

          {Array.from({ length: totalSlots }).map((_, slotIdx) => {
            const isHourStart = slotIdx % 2 === 0;
            const currentHour = startTime + Math.floor(slotIdx / 2);
            const timeKey = `${currentHour}:${slotIdx % 2 !== 0 ? "30" : "00"}`;

            return (
              <React.Fragment key={`row-${timeKey}`}>
                <div className="sticky left-0 z-20 h-[40px] w-10 bg-k-5">
                  {isHourStart && (
                    <span className="absolute -top-2 left-0 z-30 w-full text-center text-b3 text-k-500">
                      {String(currentHour)}
                    </span>
                  )}
                </div>

                {dates.map((date, dateIdx) => {
                  const cellKey = `${date.getTime()}-${timeKey}`;
                  return (
                    <TimetableSlot
                      key={cellKey}
                      isSelected={selectedSlots.has(cellKey)}
                      onMouseDown={() => handleMouseDown(dateIdx, slotIdx)}
                      onMouseEnter={() => handleMouseEnter(dateIdx, slotIdx)}
                      className="touch-none"
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
