import { IconButton } from "@/shared/components/icon-button";
import { MinusIcon, PlusIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface StepperProps {
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
      <IconButton
        icon={MinusIcon}
        size="xl"
        background="square"
        backgroundSize="md"
        variant="surface"
        iconSize="lg"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="감소"
        className="disabled:cursor-not-allowed disabled:opacity-50"
      />

      <span className="text-center text-b2 text-k-900">{value}명</span>

      <IconButton
        icon={PlusIcon}
        size="xl"
        background="square"
        backgroundSize="md"
        variant="primary"
        iconSize="lg"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="증가"
        className="disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
