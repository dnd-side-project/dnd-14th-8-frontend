import { cn } from "@/shared/utils/cn";

export interface DotPinProps {
  /** 화면 낭독기가 읽는 이름. 화면에는 보이지 않는다. */
  text: string;
  /** TextPin과 같은 색 이름이다. blue는 내 출발지, black은 다른 사람 출발지다. */
  variant: "blue" | "black";
  className?: string;
}

/**
 * 지도를 축소했을 때 이름표(TextPin) 대신 그리는 점. 지름 14px이고 흰 테두리 2px를 포함한다.
 * 꼬리가 없으므로 지도에 올릴 때는 MapMarker의 anchor를 center로 두어 좌표가 점의 한가운데에 오게 한다.
 */
export function DotPin({ text, variant, className }: DotPinProps) {
  return (
    <div
      className={cn(
        "size-3.5 rounded-full border-2 border-fill-neutral-faintest shadow-[0_0_4px_rgba(0,0,0,0.25)]",
        variant === "blue"
          ? "bg-fill-brand-default"
          : "bg-fill-neutral-default",
        className,
      )}
    >
      <span className="sr-only">{text}</span>
    </div>
  );
}
