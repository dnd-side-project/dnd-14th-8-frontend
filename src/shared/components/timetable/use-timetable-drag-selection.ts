import { useCallback, useEffect, useMemo, useRef } from "react";

export type DragPos = { dateIdx: number; slotIdx: number };

interface UseTimetableDragSelectionParams {
  dates: Date[];
  startTime: number;
  selected: Date[];
  onSelect?: (dates: Date[]) => void;
}

export function useTimetableDragSelection({
  dates,
  startTime,
  selected,
  onSelect,
}: UseTimetableDragSelectionParams) {
  const selectedSlots = useMemo(() => {
    return new Set(selected.map((date) => date.getTime().toString()));
  }, [selected]);

  const isMouseDownRef = useRef(false);
  const dragStartPosRef = useRef<DragPos | null>(null);
  const dragModeRef = useRef<"add" | "remove">("add");

  const initialSelectedBeforeDragRef = useRef<Set<string>>(new Set());

  const getSlotDate = useCallback(
    (dateIdx: number, slotIdx: number) => {
      const baseDate = dates[dateIdx];
      const hour = startTime + Math.floor(slotIdx / 2);
      const minutes = slotIdx % 2 !== 0 ? 30 : 0;

      const slotDate = new Date(baseDate);
      slotDate.setHours(hour, minutes, 0, 0);
      return slotDate;
    },
    [dates, startTime],
  );

  const updateRangeSelection = useCallback(
    (currentPos: DragPos) => {
      if (!dragStartPosRef.current || !onSelect) return;

      const start = dragStartPosRef.current;
      const minDateIdx = Math.min(start.dateIdx, currentPos.dateIdx);
      const maxDateIdx = Math.max(start.dateIdx, currentPos.dateIdx);
      const minSlotIdx = Math.min(start.slotIdx, currentPos.slotIdx);
      const maxSlotIdx = Math.max(start.slotIdx, currentPos.slotIdx);

      const nextSelectedSet = new Set(initialSelectedBeforeDragRef.current);

      for (let d = minDateIdx; d <= maxDateIdx; d++) {
        for (let s = minSlotIdx; s <= maxSlotIdx; s++) {
          const slotDate = getSlotDate(d, s);
          const timeStr = slotDate.getTime().toString();

          if (dragModeRef.current === "add") {
            nextSelectedSet.add(timeStr);
          } else {
            nextSelectedSet.delete(timeStr);
          }
        }
      }

      const resultDates = Array.from(nextSelectedSet).map(
        (time) => new Date(Number(time)),
      );
      onSelect(resultDates);
    },
    [getSlotDate, onSelect],
  );

  const handleMouseDown = (dateIdx: number, slotIdx: number) => {
    const slotDate = getSlotDate(dateIdx, slotIdx);
    const isSelected = selectedSlots.has(slotDate.getTime().toString());

    isMouseDownRef.current = true;
    dragStartPosRef.current = { dateIdx, slotIdx };
    dragModeRef.current = isSelected ? "remove" : "add";

    initialSelectedBeforeDragRef.current = new Set(selectedSlots);

    updateRangeSelection({ dateIdx, slotIdx });
  };

  const handleMouseEnter = (dateIdx: number, slotIdx: number) => {
    if (!isMouseDownRef.current) return;
    updateRangeSelection({ dateIdx, slotIdx });
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isMouseDownRef.current = false;
      dragStartPosRef.current = null;
    };
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
  }, []);

  return {
    selectedSlots,
    handleMouseDown,
    handleMouseEnter,
  };
}
