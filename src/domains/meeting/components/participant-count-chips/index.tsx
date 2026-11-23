import { Chip, Fieldset } from "@moyeorak/design-system";
import { useEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";
import {
  attachRevealFocusedChip,
  revealInScroller,
} from "@/shared/utils/reveal-in-scroller";

export const PARTICIPANT_COUNT_MIN = 2;
export const PARTICIPANT_COUNT_MAX = 20;

export interface ParticipantCountChipsProps {
  /** 아직 고르지 않았으면 비워 둔다. */
  value?: number;
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
  // 칩을 눌러 값이 바뀌었는지. 누른 칩은 줄을 움직이지 않는다(반쯤 보이는 칩을 눌러도 그대로).
  const changedByChipRef = useRef(false);

  // 바깥에서 정한 인원이 다 보이지 않으면(예: 인원 수정에서 15명) 가운데로 가로로만 스크롤해,
  // 늘리거나 줄일 양옆 인원도 함께 보이게 한다. 인원 수정은 임시 값(2명)으로 먼저 그린 뒤
  // 서버 값으로 바꾸므로, 처음 한 번이 아니라 값이 바뀔 때마다 본다.
  useEffect(() => {
    if (changedByChipRef.current) {
      changedByChipRef.current = false;
      return;
    }
    if (value === undefined) return;
    const scroller = scrollerRef.current;
    const chip = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!chip || !scroller) return;
    revealInScroller(scroller, chip, { align: "center" });
  }, [value]);

  useEffect(() => attachRevealFocusedChip(scrollerRef.current), []);

  return (
    // WebKit(아이폰)은 세로 flex 안에 바로 둔 fieldset의 높이에 legend와 그 아래 간격(29px)을 한 번 더 센다.
    // 그러면 모임 생성 화면이 29px 길어져 아래 버튼이 화면 밖으로 내려간다. div로 감싸 flex 항목이 되지 않게 한다(#279).
    <div className={cn("w-full", className)}>
      <Fieldset label="인원" helperText={helperText}>
        {/* 스크롤 영역은 세로로도 잘라내서, 포커스 링(두께 2px, 간격 2px)이 들어갈 4px를 위아래에 두고 margin으로 되돌린다. */}
        <div
          ref={scrollerRef}
          className="scrollbar-hide -mx-5 -my-1 flex gap-2 overflow-x-auto px-5 py-1"
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
                  if (count !== value) changedByChipRef.current = true;
                  onChange(count);
                }}
              >
                {count}명
              </Chip>
            );
          })}
        </div>
      </Fieldset>
    </div>
  );
}
