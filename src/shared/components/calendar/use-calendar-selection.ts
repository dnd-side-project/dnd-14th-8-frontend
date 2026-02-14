import { isSameDay } from "date-fns";
import {
  type MouseEvent as ReactMouseEvent,
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
  const [internalSelected, setInternalSelected] = useState<Date[]>(() =>
    getSortedUniqueDates(defaultSelected ?? []),
  );

  // 드래그 선택(add/remove) 진행 상태를 ref로 관리한다.
  // 빈번한 마우스 이벤트마다 렌더링이 발생하지 않도록 state 대신 ref를 사용한다.
  const dragStartDateRef = useRef<Date | null>(null);
  const dragBaseDatesRef = useRef<Date[]>([]);
  const dragModeRef = useRef<DragSelectionMode>("add");
  const dragCommittedRef = useRef(false);
  const isMouseDownRef = useRef(false);

  // 드래그 종료 직후 click 이벤트가 한 번 더 들어와 토글되는 것을 막기 위한 guard.
  const suppressClickDayKeyRef = useRef<string | null>(null);
  const suppressClickUntilMsRef = useRef(0);

  const selectedDates = useMemo(
    () =>
      getSortedUniqueDates((isControlled ? selected : internalSelected) ?? []),
    [internalSelected, isControlled, selected],
  );
  const selectedDatesRef = useRef<Date[]>(selectedDates);

  // 이벤트 핸들러에서 최신 선택 상태를 즉시 참조할 수 있도록 동기화한다.
  useEffect(() => {
    selectedDatesRef.current = selectedDates;
  }, [selectedDates]);

  useEffect(() => {
    // drag 시작점/모드(add|remove)는 mousedown 시점에 결정한다.
    function handleMouseDown(event: MouseEvent) {
      if (!enableDragSelection || event.button !== 0) {
        return;
      }

      if (suppressClickUntilMsRef.current <= Date.now()) {
        suppressClickDayKeyRef.current = null;
        suppressClickUntilMsRef.current = 0;
      }

      const dayMeta = getCalendarDayMeta(calendarId, event.target);

      if (!dayMeta || dayMeta.isBlocked) {
        return;
      }

      dragCommittedRef.current = false;
      dragStartDateRef.current = dayMeta.date;
      dragBaseDatesRef.current = selectedDatesRef.current;
      dragModeRef.current = dayMeta.isSelected ? "remove" : "add";
      isMouseDownRef.current = true;
    }

    // drag가 실제로 반영되었다면 mouseup 직후 click 토글을 일시적으로 무시한다.
    function handleMouseUp() {
      if (dragCommittedRef.current && dragStartDateRef.current) {
        suppressClickDayKeyRef.current = getCalendarDateKey(
          dragStartDateRef.current,
        );
        suppressClickUntilMsRef.current = Date.now() + 250;
      }

      dragCommittedRef.current = false;
      dragStartDateRef.current = null;
      dragBaseDatesRef.current = [];
      dragModeRef.current = "add";
      isMouseDownRef.current = false;
    }

    window.addEventListener("mousedown", handleMouseDown, true);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown, true);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [calendarId, enableDragSelection]);

  // 선택 배열을 정규화(중복 제거/정렬)하고 controlled/uncontrolled 상태를 동시에 처리한다.
  function applySelection(nextDates: Date[]) {
    const normalizedDates = getSortedUniqueDates(nextDates);

    if (isSameDateList(selectedDatesRef.current, normalizedDates)) {
      return;
    }

    selectedDatesRef.current = normalizedDates;

    if (!isControlled) {
      setInternalSelected(normalizedDates);
    }

    onSelect?.(normalizedDates);
  }

  // DayPicker 기본 multiple 선택 결과를 받는다.
  // 단, drag 직후 발생한 click 토글은 guard 조건에서 무시한다.
  const handleSelect: OnSelectHandler<Date[] | undefined> = (
    nextDates,
    triggerDate,
    _modifiers,
    event,
  ) => {
    if (
      suppressClickDayKeyRef.current === getCalendarDateKey(triggerDate) &&
      suppressClickUntilMsRef.current > Date.now() &&
      event instanceof MouseEvent
    ) {
      suppressClickDayKeyRef.current = null;
      suppressClickUntilMsRef.current = 0;
      return;
    }

    applySelection(nextDates ?? []);
  };

  // drag 중 포인터가 다른 날짜로 진입하면 baseDates + range 계산으로 선택을 갱신한다.
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
