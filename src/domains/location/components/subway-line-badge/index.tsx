import { getSubwayLineColor } from "@/domains/location/constants/subway-line-colors";
import { cn } from "@/shared/utils/cn";

export interface SubwayLineBadgeProps {
  /** 백엔드가 주는 노선 이름("2호선", "경의중앙선") */
  line: string;
}

/**
 * 노선 색 바탕에 노선 이름을 쓴 배지(#261).
 * 색 표에 없는 노선은 회색 바탕에 이름만 보여 준다. 뜻은 글자가 전하고 색은 거든다.
 */
export function SubwayLineBadge({ line }: SubwayLineBadgeProps) {
  const color = getSubwayLineColor(line);

  return (
    <span
      className={cn(
        "textStyle_caption2 whitespace-nowrap rounded-full px-1.5",
        !color && "bg-fill-neutral-subtler text-fg-neutral-default",
        color?.text === "light" && "text-fg-neutral-faintest",
        color?.text === "dark" && "text-fg-neutral-stronger",
      )}
      // 노선 색은 디자인 시스템 토큰이 아니라 노선마다 정해진 데이터라 인라인으로 넣는다(AGENTS.md 예외).
      style={color ? { backgroundColor: color.background } : undefined}
    >
      {line}
    </span>
  );
}
