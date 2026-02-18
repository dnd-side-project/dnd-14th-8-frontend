import { useId } from "react";
import { IconButton } from "@/shared/components/icon-button";
import { MinusIcon, PlusIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface StepperProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Stepper({
  value,
  label,
  min = 2,
  max = 20,
  onChange,
  className,
}: StepperProps) {
  const id = useId();

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <label htmlFor={id} className="text-b3 text-k-900">
          {label}
        </label>
      )}
      <div className="flex h-14 w-full items-center justify-between rounded-lg bg-k-50 px-4">
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

        <span
          id={id}
          role="spinbutton"
          className="text-center text-b2 text-k-900"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        >
          {value}명
        </span>

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
    </div>
  );
}
