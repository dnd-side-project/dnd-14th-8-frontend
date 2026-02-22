import {
  Fragment,
  type PointerEvent as ReactPointerEvent,
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  stickyHeaderTop?: number;
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
  stickyHeaderTop = 0,
}: TimetableProps) {
  const totalSlots = (endTime - startTime) * 2;

  const {
    selectedSlots,
    isDraggingSelection,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useTimetableDragSelection({
    dates,
    startTime,
    selected,
    onSelect,
  });

  const opacityMap = useMemo(() => getOpacityMap(occupancy), [occupancy]);
  const headerTrackRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | null>(null);
  const pendingScrollLeftRef = useRef(0);

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date);
  };

  const getFormattedDate = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}.${dd}`;
  };

  const bodyGridTemplateColumns = useMemo(() => {
    if (dates.length <= 4) {
      return `20px repeat(${dates.length}, 1fr)`;
    }
    return `20px repeat(${dates.length}, 62px)`;
  }, [dates.length]);

  const headerGridTemplateColumns = useMemo(() => {
    if (dates.length <= 4) {
      return `repeat(${dates.length}, minmax(0, 1fr))`;
    }
    return `repeat(${dates.length}, 62px)`;
  }, [dates.length]);

  const syncHeaderTrack = useCallback(() => {
    if (!headerTrackRef.current) {
      frameIdRef.current = null;
      return;
    }

    headerTrackRef.current.style.transform = `translate3d(${-pendingScrollLeftRef.current}px, 0, 0)`;
    frameIdRef.current = null;
  }, []);

  const handleBodyScroll = (event: UIEvent<HTMLDivElement>) => {
    pendingScrollLeftRef.current = event.currentTarget.scrollLeft;

    if (frameIdRef.current !== null) {
      return;
    }

    frameIdRef.current = window.requestAnimationFrame(syncHeaderTrack);
  };

  const getSlotPosFromPoint = (
    container: HTMLDivElement,
    clientX: number,
    clientY: number,
  ) => {
    const target = document.elementFromPoint(
      clientX,
      clientY,
    ) as HTMLElement | null;

    if (!target || !container.contains(target)) {
      return null;
    }

    const slotElement = target.closest<HTMLElement>(
      "[data-date-idx][data-slot-idx]",
    );
    if (!slotElement) {
      return null;
    }

    const dateIdx = Number(slotElement.dataset.dateIdx);
    const slotIdx = Number(slotElement.dataset.slotIdx);

    if (Number.isNaN(dateIdx) || Number.isNaN(slotIdx)) {
      return null;
    }

    return { dateIdx, slotIdx };
  };

  const handleBodyPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    const pos = getSlotPosFromPoint(
      event.currentTarget,
      event.clientX,
      event.clientY,
    );

    const shouldPreventScroll = handlePointerMove({
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      clientX: event.clientX,
      clientY: event.clientY,
      pos,
    });

    if (shouldPreventScroll) {
      event.preventDefault();
    }
  };

  const handleBodyPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    handlePointerUp(event.pointerId);
  };

  useEffect(() => {
    const bodyElement = bodyScrollRef.current;

    if (!bodyElement) {
      return;
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingSelection) {
        return;
      }

      event.preventDefault();
    };

    bodyElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      bodyElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDraggingSelection]);

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        window.cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full select-none", className)}>
      <div className="sticky z-10 bg-k-5" style={{ top: stickyHeaderTop }}>
        <div className="flex gap-1 pb-3">
          <div className="sticky left-0 z-10 h-[58px] w-5 shrink-0 bg-k-5" />

          <div
            className="min-w-0 flex-1 overflow-hidden"
            data-timetable-scroll="header"
          >
            <div
              ref={headerTrackRef}
              className={cn(
                "grid gap-1 will-change-transform",
                dates.length > 4 && "min-w-max",
              )}
              style={{ gridTemplateColumns: headerGridTemplateColumns }}
            >
              {dates.map((date) => (
                <div
                  key={`header-${date.toISOString()}`}
                  className="flex h-[54px] flex-col items-center justify-center bg-k-5"
                >
                  <span className="text-b3 text-k-500">{getDayName(date)}</span>
                  <span className="text-b3 text-k-700">
                    {getFormattedDate(date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={bodyScrollRef}
        onScroll={handleBodyScroll}
        onPointerMove={handleBodyPointerMove}
        onPointerUp={handleBodyPointerUp}
        onPointerCancel={handleBodyPointerUp}
        className={cn(
          "overflow-x-auto overflow-y-hidden overscroll-x-contain",
          isDraggingSelection ? "touch-none" : "touch-auto",
        )}
        data-timetable-scroll="body"
      >
        <div
          className="grid min-w-max gap-1"
          style={{ gridTemplateColumns: bodyGridTemplateColumns }}
        >
          {Array.from({ length: totalSlots }).map((_, slotIdx) => {
            const isHourStart = slotIdx % 2 === 0;
            const currentHour = startTime + Math.floor(slotIdx / 2);
            const currentMinutes = slotIdx % 2 !== 0 ? 30 : 0;
            const isFirstSlot = slotIdx === 0;
            const isLastSlot = slotIdx === totalSlots - 1;

            return (
              <Fragment key={`row-${currentHour}-${currentMinutes}`}>
                <div className="sticky left-0 z-20 -mr-2 h-[40px] w-5 bg-k-5">
                  {isHourStart && (
                    <span
                      className={cn(
                        "absolute left-0 z-20 w-full bg-k-5 text-b3 text-k-500",
                        isFirstSlot ? "top-0" : "-top-2.5",
                      )}
                    >
                      {String(currentHour)}
                    </span>
                  )}

                  {isLastSlot && (
                    <span className="absolute bottom-0 left-0 z-20 w-full bg-k-5 text-b3 text-k-500">
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
                      dataDateIdx={dateIdx}
                      dataSlotIdx={slotIdx}
                      onPointerDown={(event) => {
                        if (disabled) {
                          return;
                        }

                        handlePointerDown({
                          dateIdx,
                          slotIdx,
                          pointerId: event.pointerId,
                          pointerType: event.pointerType,
                          clientX: event.clientX,
                          clientY: event.clientY,
                        });

                        if (event.pointerType === "touch") {
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          return;
                        }

                        event.preventDefault();
                      }}
                      className={cn(disabled && "cursor-default")}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
