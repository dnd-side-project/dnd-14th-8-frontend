import { type ChangeEvent, useCallback, useId, useState } from "react";

interface UseTextFieldOptions {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onValueChange?: (value: string) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function useTextField({
  value,
  defaultValue,
  onValueChange,
  onChange,
}: UseTextFieldOptions) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(
    (defaultValue as string) ?? "",
  );

  const currentValue = value !== undefined ? String(value) : internalValue;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalValue(e.target.value);
      onValueChange?.(e.target.value);
      onChange?.(e);
    },
    [value, onValueChange, onChange],
  );

  const handleClear = useCallback(() => {
    if (value === undefined) setInternalValue("");
    onValueChange?.("");
  }, [value, onValueChange]);

  return {
    id,
    focused,
    setFocused,
    currentValue,
    handleChange,
    handleClear,
  };
}
