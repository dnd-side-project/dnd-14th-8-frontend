import type React from "react";
import { type ChangeEvent, useRef, useState } from "react";
import { ChevronDownIcon } from "@/shared/components/icons";

interface DeparturePickerProps {
  onChange: (isoValue: string) => void;
  className?: string;
}

const DeparturePicker: React.FC<DeparturePickerProps> = ({
  onChange,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getInitialDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  const [dateTime, setDateTime] = useState<string>(getInitialDateTime());

  const handleWrapperClick = () => {
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
      } catch {
        inputRef.current.click();
      }
    }
  };

  const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setDateTime(value);
    onChange(`${value}:00`);
  };

  const formatDisplay = (val: string) => {
    const date = new Date(val);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <button
      type="button"
      onClick={handleWrapperClick}
      className={`group relative inline-flex cursor-pointer items-center gap-x-1.5 rounded-xl bg-k-5 px-4 py-2 hover:bg-k-10 active:bg-k-50 ${className}`}
    >
      <div className="pointer-events-none flex items-center justify-center space-x-1">
        <span className="text-b-5 text-k-600">
          {formatDisplay(dateTime)} 출발
        </span>
        <ChevronDownIcon className="text-k-600" />
      </div>

      <input
        ref={inputRef}
        type="datetime-local"
        value={dateTime}
        onChange={handleDateTimeChange}
        className="pointer-events-auto absolute inset-0 z-10 block h-full w-full cursor-pointer appearance-none opacity-0"
        title="출발 시각 선택"
      />
    </button>
  );
};

export default DeparturePicker;
