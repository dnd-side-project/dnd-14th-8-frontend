import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

export type SheetSnap = "full" | "half" | "peek";

const HANDLE_HEIGHT_PX = 36;
const SNAP_CONTENT_HEIGHT_PX: Record<SheetSnap, number> = {
  peek: 219,
  half: 494,
  full: 711,
};

function getSheetHeightBySnap(snap: SheetSnap) {
  return SNAP_CONTENT_HEIGHT_PX[snap] + HANDLE_HEIGHT_PX;
}

export interface BottomSheetProps {
  children: ReactNode;
  defaultSnap?: SheetSnap;
  onHeightChange?: (height: number) => void;
  className?: string;
}

/** 3단계 스냅 바텀시트 (content: 219 / 494 / 711px) */
export function BottomSheet({
  children,
  defaultSnap = "half",
  onHeightChange,
  className,
}: BottomSheetProps) {
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  const [snap, setSnap] = useState<SheetSnap>(defaultSnap);
  const [dragging, setDragging] = useState(false);
  const [height, setHeight] = useState(() => getSheetHeightBySnap(defaultSnap));

  useEffect(() => {
    setHeight(getSheetHeightBySnap(snap));
  }, [snap]);

  useEffect(() => {
    onHeightChange?.(height);
  }, [height, onHeightChange]);

  const minHeight = getSheetHeightBySnap("peek");
  const maxHeight = getSheetHeightBySnap("full");

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = height;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;

    const deltaY = dragStartYRef.current - e.clientY;
    const nextHeight = dragStartHeightRef.current + deltaY;

    setHeight(Math.max(minHeight, Math.min(maxHeight, nextHeight)));
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    const snaps: SheetSnap[] = ["peek", "half", "full"];
    const nextSnap = snaps.reduce((bestSnap, currentSnap) => {
      const bestDistance = Math.abs(height - getSheetHeightBySnap(bestSnap));
      const currentDistance = Math.abs(
        height - getSheetHeightBySnap(currentSnap),
      );
      return currentDistance < bestDistance ? currentSnap : bestSnap;
    }, "peek" as SheetSnap);

    setSnap(nextSnap);
  };

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-2xl bg-k-5",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.12)]",
        !dragging && "transition-[height] duration-300 ease-out",
        className,
      )}
      style={{ height }}
    >
      <div
        className="flex shrink-0 cursor-grab items-center justify-center py-4 active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="h-1 w-9 rounded-full bg-k-200" />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
