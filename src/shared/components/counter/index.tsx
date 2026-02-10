import MinusIcon from "@/assets/icons/minus.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { cn } from "@/shared/utils/cn";

interface CounterProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

function Counter({
  value,
  min = 2,
  max = 50,
  onChange,
  className,
}: CounterProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="flex size-7 cursor-pointer items-center justify-center rounded bg-white text-k-600 disabled:cursor-not-allowed disabled:text-k-300"
        aria-label="감소"
      >
        <MinusIcon className="size-4" />
      </button>
      <span className="min-w-[2ch] text-center text-b1 text-k-900">
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex size-7 cursor-pointer items-center justify-center rounded bg-primary-main text-white disabled:cursor-not-allowed disabled:bg-k-200 disabled:text-k-400"
        aria-label="증가"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}

export { Counter };
export type { CounterProps };
