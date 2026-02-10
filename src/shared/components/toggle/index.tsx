import { cn } from "@/shared/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label
      className={cn("inline-flex cursor-pointer items-center gap-2", className)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-[44px] cursor-pointer items-center rounded-full transition-colors",
          checked ? "bg-primary-main" : "bg-k-300",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
      {label && <span className="text-b4 text-k-900">{label}</span>}
    </label>
  );
}

export { Toggle };
export type { ToggleProps };
