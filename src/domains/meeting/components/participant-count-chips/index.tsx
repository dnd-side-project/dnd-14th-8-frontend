import { Chip, Fieldset } from "@moyeorak/design-system";
import { useEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";

export const PARTICIPANT_COUNT_MIN = 2;
export const PARTICIPANT_COUNT_MAX = 20;

export interface ParticipantCountChipsProps {
  value: number;
  onChange: (value: number) => void;
  /** 이보다 적은 인원은 비활성으로 보이고, 누르면 onBlockedSelect를 부른다. */
  selectableMin?: number;
  onBlockedSelect?: () => void;
  helperText?: string;
  className?: string;
}

const COUNTS = Array.from(
  { length: PARTICIPANT_COUNT_MAX - PARTICIPANT_COUNT_MIN + 1 },
  (_, index) => PARTICIPANT_COUNT_MIN + index,
);

/** 모임 인원을 2명부터 20명까지 Chip 가로 스크롤로 고른다. */
export function ParticipantCountChips({
  value,
  onChange,
  selectableMin = PARTICIPANT_COUNT_MIN,
  onBlockedSelect,
  helperText,
  className,
}: ParticipantCountChipsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // 선택한 인원이 화면 밖에 있으면(예: 인원 수정에서 15명) 보이도록 가로로만 스크롤한다.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!chip || !scroller) return;
    const left = chip.offsetLeft - scroller.offsetLeft;
    const right = left + chip.offsetWidth;
    if (left < scroller.scrollLeft) {
      scroller.scrollLeft = left;
    } else if (right > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollLeft = right - scroller.clientWidth;
    }
  }, []);

  return (
    <Fieldset
      label="인원"
      helperText={helperText}
      className={cn("w-full", className)}
    >
      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5"
      >
        {COUNTS.map((count) => {
          const blocked = count < selectableMin;
          const selected = count === value;
          return (
            <Chip
              key={count}
              shape="square"
              pressed={selected}
              aria-disabled={blocked || undefined}
              variant={selected ? "outlined-brand" : "neutral-weak"}
              className={cn(
                "shrink-0",
                blocked && "cursor-default text-fg-neutral-subtlest",
              )}
              onClick={() => {
                if (blocked) {
                  onBlockedSelect?.();
                  return;
                }
                onChange(count);
              }}
            >
              {count}명
            </Chip>
          );
        })}
      </div>
    </Fieldset>
  );
}
