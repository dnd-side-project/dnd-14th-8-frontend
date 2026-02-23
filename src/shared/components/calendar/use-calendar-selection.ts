import { isSameDay } from "date-fns";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DayEventHandler, OnSelectHandler } from "react-day-picker";
import {
  type DragSelectionMode,
  getCalendarDateKey,
  getCalendarDayMeta,
  getCalendarDayMetaFromPoint,
  getDraggedSelection,
  isBlockedDay,
} from "./drag-selection-utils";

type UseCalendarSelectionParams = {
  calendarId: string;
  defaultSelected?: Date[];
  enableDragSelection: boolean;
  onDayMouseEnter?: DayEventHandler<ReactMouseEvent>;
  onSelect?: (dates: Date[]) => void;
  selected?: Date[];
};

export type UseCalendarSelectionResult = {
  handleDayMouseEnter: DayEventHandler<ReactMouseEvent>;
  handleSelect: OnSelectHandler<Date[] | undefined>;
  selectedDates: Date[];
};

function getSortedUniqueDates(dates: Date[]) {
  const dateMap = new Map<string, Date>();

  for (const date of dates) {
    dateMap.set(getCalendarDateKey(date), date);
  }

  return [...dateMap.values()].sort((a, b) => a.getTime() - b.getTime());
}

function isSameDateList(a: Date[], b: Date[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((date, index) => {
    const nextDate = b[index];
    return nextDate ? isSameDay(date, nextDate) : false;
  });
}

export function useCalendarSelection({
  calendarId,
  defaultSelected,
  enableDragSelection,
  onDayMouseEnter,
  onSelect,
  selected,
}: UseCalendarSelectionParams): UseCalendarSelectionResult {
  const isControlled = selected !== undefined;

  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const [internalSelected, setInternalSelected] = useState<Date[]>(() =>
    getSortedUniqueDates(defaultSelected ?? []),
  );

  const dragStartDateRef = useRef<Date | null>(null);
  const dragBaseDatesRef = useRef<Date[]>([]);
  const dragModeRef = useRef<DragSelectionMode>("add");
  const dragCommittedRef = useRef(false);
  const isMouseDownRef = useRef(false);

  const lastTouchDateKeyRef = useRef<string | null>(null);

  const suppressClickDayKeyRef = useRef<string | null>(null);
  const suppressClickUntilMsRef = useRef(0);

  const selectedDates = useMemo(
    () =>
      getSortedUniqueDates((isControlled ? selected : internalSelected) ?? []),
    [internalSelected, isControlled, selected],
  );
  const selectedDatesRef = useRef<Date[]>(selectedDates);

  useEffect(() => {
    selectedDatesRef.current = selectedDates;
  }, [selectedDates]);

  const applySelection = useCallback(
    (nextDates: Date[]) => {
      const normalizedDates = getSortedUniqueDates(nextDates);

      if (isSameDateList(selectedDatesRef.current, normalizedDates)) {
        return;
      }

      selectedDatesRef.current = normalizedDates;

      if (!isControlled) {
        setInternalSelected(normalizedDates);
      }

      onSelectRef.current?.(normalizedDates);
    },
    [isControlled],
  );

  useEffect(() => {
    const startDragging = (date: Date, isSelected: boolean) => {
      if (suppressClickUntilMsRef.current <= Date.now()) {
        suppressClickDayKeyRef.current = null;
        suppressClickUntilMsRef.current = 0;
      }
      dragCommittedRef.current = false;
      dragStartDateRef.current = date;
      dragBaseDatesRef.current = selectedDatesRef.current;
      dragModeRef.current = isSelected ? "remove" : "add";
      isMouseDownRef.current = true;
      lastTouchDateKeyRef.current = getCalendarDateKey(date);
    };

    const stopDragging = () => {
      if (dragCommittedRef.current && dragStartDateRef.current) {
        suppressClickDayKeyRef.current = getCalendarDateKey(
          dragStartDateRef.current,
        );
        suppressClickUntilMsRef.current = Date.now() + 250;
      }
      dragCommittedRef.current = false;
      dragStartDateRef.current = null;
      dragBaseDatesRef.current = [];
      isMouseDownRef.current = false;
      lastTouchDateKeyRef.current = null;
    };

    function handleMouseDown(event: MouseEvent) {
      if (!enableDragSelection || event.button !== 0) return;
      const dayMeta = getCalendarDayMeta(calendarId, event.target);
      if (!dayMeta || dayMeta.isBlocked) return;
      startDragging(dayMeta.date, dayMeta.isSelected);
    }

    function handleTouchStart(event: TouchEvent) {
      if (!enableDragSelection) return;
      const touch = event.touches[0];
      const dayMeta = getCalendarDayMetaFromPoint(
        calendarId,
        touch.clientX,
        touch.clientY,
      );
      if (!dayMeta || dayMeta.isBlocked) return;

      startDragging(dayMeta.date, dayMeta.isSelected);
    }

    function handleTouchMove(event: TouchEvent) {
      if (
        !enableDragSelection ||
        !isMouseDownRef.current ||
        !dragStartDateRef.current
      )
        return;

      const touch = event.touches[0];
      const dayMeta = getCalendarDayMetaFromPoint(
        calendarId,
        touch.clientX,
        touch.clientY,
      );
      if (!dayMeta || dayMeta.isBlocked) return;

      const dateKey = getCalendarDateKey(dayMeta.date);
      if (lastTouchDateKeyRef.current === dateKey) return;

      lastTouchDateKeyRef.current = dateKey;
      dragCommittedRef.current = true;

      const nextDates = getDraggedSelection(
        dragBaseDatesRef.current,
        dragStartDateRef.current,
        dayMeta.date,
        dragModeRef.current,
      );
      applySelection(nextDates);

      if (event.cancelable) event.preventDefault();
    }

    window.addEventListener("mousedown", handleMouseDown, true);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown, true);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [calendarId, enableDragSelection, applySelection]);

  const handleSelect: OnSelectHandler<Date[] | undefined> = (
    nextDates,
    triggerDate,
    _modifiers,
    event,
  ) => {
    if (
      suppressClickDayKeyRef.current === getCalendarDateKey(triggerDate) &&
      suppressClickUntilMsRef.current > Date.now() &&
      (event instanceof MouseEvent ||
        (typeof TouchEvent !== "undefined" && event instanceof TouchEvent))
    ) {
      suppressClickDayKeyRef.current = null;
      suppressClickUntilMsRef.current = 0;
      return;
    }

    applySelection(nextDates ?? []);
  };

  const handleDayMouseEnter: DayEventHandler<ReactMouseEvent> = (
    day,
    modifiers,
    event,
  ) => {
    onDayMouseEnter?.(day, modifiers, event);

    const dragStartDate = dragStartDateRef.current;

    if (
      !enableDragSelection ||
      !isMouseDownRef.current ||
      !dragStartDate ||
      isBlockedDay(modifiers)
    ) {
      return;
    }

    if (isSameDay(day, dragStartDate)) {
      return;
    }

    const nextDates = getDraggedSelection(
      dragBaseDatesRef.current,
      dragStartDate,
      day,
      dragModeRef.current,
    );

    dragCommittedRef.current = true;
    applySelection(nextDates);
  };

  return {
    handleDayMouseEnter,
    handleSelect,
    selectedDates,
  };
}
