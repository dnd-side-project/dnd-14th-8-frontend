import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  getNearestSnap,
  getSheetHeightBySnap,
  type SheetSnap,
} from "@/domains/location/components/bottom-sheet/snap-height";
import { cn } from "@/shared/utils/cn";

export type { SheetSnap };

export interface BottomSheetProps {
  children: ReactNode;
  defaultSnap?: SheetSnap;
  onHeightChange?: (height: number) => void;
  className?: string;
}

/** 3단계 스냅 바텀시트. 스냅 높이는 뷰포트에 맞춰 상한이 걸린다. */
export function BottomSheet({
  children,
  defaultSnap = "half",
  onHeightChange,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  const [snap, setSnap] = useState<SheetSnap>(defaultSnap);
  const [dragging, setDragging] = useState(false);
  /** 시트를 담고 있는 지도 컨테이너의 높이. 0이면 아직 측정 전이다. */
  const [containerHeight, setContainerHeight] = useState(0);
  const [height, setHeight] = useState(() =>
    getSheetHeightBySnap(defaultSnap, 0),
  );

  // window.innerHeight가 아니라 실제 컨테이너를 잰다. 시트가 늘 뷰포트 전체를
  // 차지하는 부모 안에 있다는 가정을 코드에 심지 않기 위해서다.
  useLayoutEffect(() => {
    const container = sheetRef.current?.offsetParent;
    if (!(container instanceof HTMLElement)) return;

    const observer = new ResizeObserver(() => {
      setContainerHeight(container.clientHeight);
    });

    observer.observe(container);
    setContainerHeight(container.clientHeight);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setHeight(getSheetHeightBySnap(snap, containerHeight));
  }, [snap, containerHeight]);

  // 드래그 중에는 알리지 않는다. 매 프레임 높이가 나가면 이 값으로 지도를
  // 다시 맞추는 쪽이 프레임마다 재프레이밍을 돌려 지도가 요동친다.
  useEffect(() => {
    if (dragging) return;

    onHeightChange?.(height);
  }, [dragging, height, onHeightChange]);

  const minHeight = getSheetHeightBySnap("peek", containerHeight);
  const maxHeight = getSheetHeightBySnap("full", containerHeight);

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

    const nextSnap = getNearestSnap(height, containerHeight);

    // 스냅이 그대로면 snap 변경 effect가 돌지 않아 손을 뗀 높이에 멈춘다.
    // 높이도 같이 되돌려야 항상 스냅 위치로 붙는다.
    setSnap(nextSnap);
    setHeight(getSheetHeightBySnap(nextSnap, containerHeight));
  };

  return (
    <div
      ref={sheetRef}
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
