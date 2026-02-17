import { useCallback, useEffect, useRef, useState } from "react";

export type DragPos = { dateIdx: number; slotIdx: number };

interface UseTimetableDragSelectionParams {
  dates: Date[];
  startTime: number;
  onSelect?: (selectedKeys: Set<string>) => void;
}

export function useTimetableDragSelection({
  dates,
  startTime,
  onSelect,
}: UseTimetableDragSelectionParams) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const isMouseDownRef = useRef(false);
  const dragStartPosRef = useRef<DragPos | null>(null);
  const dragModeRef = useRef<"add" | "remove">("add");
  const initialSelectedBeforeDragRef = useRef<Set<string>>(new Set());

  const getSlotKey = useCallback(
    (dateIdx: number, slotIdx: number) => {
      const date = dates[dateIdx];
      const hour = startTime + Math.floor(slotIdx / 2);
      const timeLabel = slotIdx % 2 !== 0 ? "30" : "00";
      return `${date.getTime()}-${hour}:${timeLabel}`;
    },
    [dates, startTime],
  );

  const updateRangeSelection = useCallback(
    (currentPos: DragPos) => {
      if (!dragStartPosRef.current) return;

      const start = dragStartPosRef.current;
      const minDateIdx = Math.min(start.dateIdx, currentPos.dateIdx);
      const maxDateIdx = Math.max(start.dateIdx, currentPos.dateIdx);
      const minSlotIdx = Math.min(start.slotIdx, currentPos.slotIdx);
      const maxSlotIdx = Math.max(start.slotIdx, currentPos.slotIdx);

      const nextSelected = new Set(initialSelectedBeforeDragRef.current);

      for (let d = minDateIdx; d <= maxDateIdx; d++) {
        for (let s = minSlotIdx; s <= maxSlotIdx; s++) {
          const key = getSlotKey(d, s);
          if (dragModeRef.current === "add") {
            nextSelected.add(key);
          } else {
            nextSelected.delete(key);
          }
        }
      }

      setSelectedSlots(nextSelected);
      onSelect?.(nextSelected);
    },
    [getSlotKey, onSelect],
  );

  const handleMouseDown = (dateIdx: number, slotIdx: number) => {
    const key = getSlotKey(dateIdx, slotIdx);
    const isSelected = selectedSlots.has(key);

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
