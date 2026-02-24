import { useCallback, useId, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SelectedCheckIcon,
} from "@/shared/components/icons";
import { TextField, type TextFieldProps } from "@/shared/components/text-field";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { cn } from "@/shared/utils/cn";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    TextFieldProps,
    | "clearable"
    | "defaultValue"
    | "onChange"
    | "onClear"
    | "readOnly"
    | "rightIcon"
    | "type"
    | "value"
  > {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  disabled,
  className,
  placeholder,
  name,
  id,
  ...props
}: SelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = useState(false);

  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const displayValue = selectedOption?.label ?? "";

  const listboxId = `${useId()}-listbox`;

  const closeOptions = useCallback(() => {
    setIsOpen(false);
  }, []);

  const rootRef = useOutsideClick<HTMLDivElement>(closeOptions);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (optionValue: string) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }

    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <TextField
        {...props}
        id={id}
        placeholder={placeholder}
        value={displayValue}
        disabled={disabled}
        clearable={false}
        readOnly
        rightIcon={isOpen ? ChevronUpIcon : ChevronDownIcon}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-autocomplete="none"
        className="w-full [&_input]:cursor-pointer"
      />

      {name ? (
        <input type="hidden" name={name} value={selectedValue ?? ""} />
      ) : null}

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full z-20 mt-[11px] w-full max-w-[250px] overflow-hidden rounded-xl bg-k-5 shadow-[0_0_10px_0_rgba(0,0,0,0.12)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left text-b1 text-k-900 transition-colors",
                  index > 0 && "border-k-50 border-t",
                  isSelected && "text-primary-main",
                )}
                onClick={() => handleOptionClick(option.value)}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <SelectedCheckIcon
                    aria-hidden
                    className="size-6 shrink-0 text-primary-main"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
