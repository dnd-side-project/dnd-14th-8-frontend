import MinusIcon from "@/assets/icons/minus.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { cn } from "@/shared/utils/cn";

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Stepper({
  value,
  min = 2,
  max = 20,
  onChange,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-full items-center justify-between rounded-lg bg-k-50 px-4",
        className,
      )}
    >
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-k-5 text-k-500 disabled:cursor-not-allowed"
        aria-label="감소"
      >
        <MinusIcon className="size-6" />
      </button>
      <span className="text-center text-b2 text-k-900">{value}명</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-primary-main text-k-5 disabled:cursor-not-allowed"
        aria-label="증가"
      >
        <PlusIcon className="size-6" />
      </button>
    </div>
  );
}
