import type { ButtonHTMLAttributes } from "react";
import { getDurationParts } from "@/domains/location/utils/format";
import { cn } from "@/shared/utils/cn";

export interface StationCardProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "aria-pressed"
  > {
  rank: number;
  /** 화면에 보일 역 이름. "역"은 부르는 쪽에서 `formatStationName`으로 붙인다. */
  name: string;
  /** 평균 대중교통 시간(분) */
  durationMinutes: number;
  selected?: boolean;
}

/**
 * 추천역 한 곳을 고르는 카드. 가로로 넘기는 줄에 나란히 둔다.
 *
 * 너비는 192px가 최소이고 역 이름이 길면 늘어난다(줄 안에서 줄어들지 않는다).
 * 고른 상태는 색과 함께 `aria-pressed`로도 알린다.
 * 역 주소 줄은 백엔드가 주소를 줄 때 이름 아래에 넣는다(#259).
 */
export function StationCard({
  rank,
  name,
  durationMinutes,
  selected = false,
  className,
  ...props
}: StationCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex min-w-48 shrink-0 cursor-pointer flex-col items-start rounded-xl border p-4 text-left transition-colors",
        // 디자인 시스템 focusRing과 같은 값이다(두께 2px, 간격 2px, 키보드로 옮겼을 때만).
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        // 고른 카드는 눌러도 바뀌는 것이 없어 누름 색을 두지 않는다.
        selected
          ? "border-stroke-brand-default bg-fill-brand-subtlest"
          : "border-stroke-neutral-subtle bg-fill-neutral-faintest active:bg-fill-neutral-subtler",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {/* 디자인 시스템 Badge에는 진한 파란 바탕과 18px 정사각형 크기가 없어 직접 그린다. */}
        <span className="textStyle_caption1 flex size-[18px] shrink-0 items-center justify-center rounded bg-fill-brand-default text-fg-neutral-faintest">
          {rank}
          <span className="sr-only">위</span>
        </span>
        <span className="textStyle_title3 whitespace-nowrap text-fg-neutral-strong">
          {name}
        </span>
      </span>
      <span className="mt-4 flex items-baseline gap-1 whitespace-nowrap text-fg-neutral-strong">
        {getDurationParts(durationMinutes).map(({ value, unit }) => (
          <span key={unit}>
            <span className="textStyle_head2">{value}</span>
            <span className="textStyle_caption1">{unit}</span>
          </span>
        ))}
      </span>
    </button>
  );
}
