import { cn } from "@/shared/utils/cn";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * 몇 안 되는 선택지 중 하나를 고르는 작은 스위치(#273). 디자인 시스템에 같은 부품이 없어 서비스 코드에 둔다.
 * 색, 글자, 모서리는 디자인 시스템 토큰만 쓴다. 칩 줄(무엇을 찾을지) 아래의 기준처럼 한 단계 낮게 보이도록
 * 화면 폭을 채우지 않고 글자 길이만큼만 차지하며, 바탕은 아주 옅고 고른 칸만 흰 바탕으로 살짝 띄운다.
 *
 * 보이는 칸 높이는 28px이지만 누르는 영역은 위아래 8px씩 늘려 44px다(Apple 최소 누르기 영역 44pt).
 * 부르는 쪽은 위아래 8px 안에 다른 누를 것을 두지 않아야 영역이 겹치지 않는다.
 * 칸마다 aria-pressed로 고른 상태를 알리고, 포커스 링은 디자인 시스템 focusRing과 같은 값(2px, 간격 2px)이다.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex gap-0.5 rounded-lg bg-fill-neutral-subtlest p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "textStyle_body5 relative h-7 cursor-pointer rounded-md px-3 transition-colors",
              // 보이지 않는 누르는 영역: 위아래 8px씩 늘려 44px
              "before:absolute before:inset-x-0 before:-top-2 before:-bottom-2",
              "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
              selected
                ? "bg-bg-neutral-default font-semibold text-fg-neutral-strong shadow-[0_1px_2px_rgba(0,0,0,0.10)]"
                : "text-fg-neutral-subtle",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
