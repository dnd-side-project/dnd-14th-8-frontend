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
  /**
   * 부르는 쪽이 정하는 스냅. 값이 바뀔 때마다 그 스냅으로 옮긴다(예: 결과 화면에서 장소를 고르면 peek,
   * 닫으면 half, #271). 그사이 사용자가 끌어 바꾼 스냅은 이 값이 다시 바뀔 때까지 그대로 둔다.
   * 넘기지 않으면 defaultSnap에서 시작해 끌기로만 바뀐다.
   */
  snap?: SheetSnap;
  /**
   * peek일 때 손잡이 아래 콘텐츠 높이. 넘기면 peek을 시안 높이 대신 이 내용에 맞춘다
   * (예: 결과 화면에서 고른 장소 카드만 있을 때, #271). 끌어 내릴 수 있는 가장 낮은 높이도 이 값이 된다.
   */
  peekContentHeight?: number;
  onHeightChange?: (height: number) => void;
  className?: string;
}

/** 3단계 스냅 바텀시트. 스냅 높이는 뷰포트에 맞춰 상한이 걸린다. */
export function BottomSheet({
  children,
  defaultSnap = "half",
  snap: requestedSnap,
  peekContentHeight,
  onHeightChange,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  const initialSnap = requestedSnap ?? defaultSnap;
  const [snap, setSnap] = useState<SheetSnap>(initialSnap);
  const [dragging, setDragging] = useState(false);
  /** 시트를 담고 있는 지도 컨테이너의 높이. 0이면 아직 측정 전이다. */
  const [containerHeight, setContainerHeight] = useState(0);
  const [height, setHeight] = useState(() =>
    getSheetHeightBySnap(initialSnap, 0, peekContentHeight),
  );

  // 부르는 쪽이 스냅이나 peek 내용 높이를 바꾸면 렌더 중에 스냅과 높이를 함께 바꾼다. 높이를 아래 효과로
  // 미루면 새 높이를 한 번 늦게 알려, 그사이 부르는 쪽이 예전 높이로 지도를 계산한다.
  const [appliedRequestedSnap, setAppliedRequestedSnap] =
    useState(requestedSnap);
  const [appliedPeekContentHeight, setAppliedPeekContentHeight] =
    useState(peekContentHeight);
  if (requestedSnap !== appliedRequestedSnap) {
    setAppliedRequestedSnap(requestedSnap);
    setAppliedPeekContentHeight(peekContentHeight);
    if (requestedSnap) {
      setSnap(requestedSnap);
      setHeight(
        getSheetHeightBySnap(requestedSnap, containerHeight, peekContentHeight),
      );
    }
  } else if (peekContentHeight !== appliedPeekContentHeight) {
    setAppliedPeekContentHeight(peekContentHeight);
    if (snap === "peek" && !dragging) {
      setHeight(
        getSheetHeightBySnap("peek", containerHeight, peekContentHeight),
      );
    }
  }

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
    setHeight(getSheetHeightBySnap(snap, containerHeight, peekContentHeight));
  }, [snap, containerHeight, peekContentHeight]);

  // 드래그 중에는 알리지 않는다. 매 프레임 높이가 나가면 이 값으로 지도를
  // 다시 맞추는 쪽이 프레임마다 재프레이밍을 돌려 지도가 요동친다.
  useEffect(() => {
    if (dragging) return;

    onHeightChange?.(height);
  }, [dragging, height, onHeightChange]);

  const minHeight = getSheetHeightBySnap(
    "peek",
    containerHeight,
    peekContentHeight,
  );
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

    const nextSnap = getNearestSnap(height, containerHeight, peekContentHeight);

    // 스냅이 그대로면 snap 변경 effect가 돌지 않아 손을 뗀 높이에 멈춘다.
    // 높이도 같이 되돌려야 항상 스냅 위치로 붙는다.
    setSnap(nextSnap);
    setHeight(
      getSheetHeightBySnap(nextSnap, containerHeight, peekContentHeight),
    );
  };

  return (
    <div
      ref={sheetRef}
      className={cn(
        "absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-2xl bg-bg-neutral-default",
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
        <div className="h-1 w-9 rounded-full bg-fill-neutral-subtle" />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
