import type { ButtonHTMLAttributes } from "react";
import { SubwayLineBadge } from "@/domains/location/components/subway-line-badge";
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
  /** 그 역의 노선 전체. 백엔드가 정렬한 순서대로 보여 준다. */
  lines?: string[];
  /** 평균 대중교통 시간(분) */
  durationMinutes: number;
  selected?: boolean;
}

/**
 * 추천역 한 곳을 고르는 카드. 가로로 넘기는 줄에 나란히 둔다.
 *
 * 너비는 192px이고, 역 이름이 그보다 길 때만 늘어난다(줄 안에서 줄어들지 않는다).
 * 노선 배지는 카드를 넓히지 않고 안쪽 폭에서 줄을 바꾼다(#261).
 * 고른 상태는 색과 함께 `aria-pressed`로도 알린다.
 */
export function StationCard({
  rank,
  name,
  lines = [],
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
      {lines.length > 0 && (
        // w-0과 min-w-full로 배지 줄이 카드 폭을 정하지 않고, 이름이 정한 폭 안에서 줄을 바꾼다.
        <span className="mt-1.5 flex w-0 min-w-full flex-wrap gap-1">
          {lines.map((line) => (
            <SubwayLineBadge key={line} line={line} />
          ))}
        </span>
      )}
      {/* 카드 줄은 가장 높은 카드에 키를 맞춘다. 시간 줄을 아래에 붙여 남는 높이는 위로 보내고, 카드끼리 시간 줄 높이를 맞춘다(#261). 위 간격 16px은 pt-4가 지킨다. */}
      <span className="mt-auto flex items-baseline gap-1 whitespace-nowrap pt-4 text-fg-neutral-strong">
        {/* 이 시간은 참여자들의 대중교통 시간 평균이다. 적지 않으면 내 시간으로 읽힌다. */}
        <span className="textStyle_caption1">평균</span>
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
