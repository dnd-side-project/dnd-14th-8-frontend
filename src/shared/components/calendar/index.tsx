import { Icon, IconButton } from "@moyeorak/design-system";
import { format } from "date-fns";
import type { Locale } from "date-fns/locale";
import { ko } from "date-fns/locale";
import { type ComponentProps, useId } from "react";
import type { Matcher, PropsBase } from "react-day-picker";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/shared/utils/cn";
import { getCalendarClassNames } from "./class-names";
import { useCalendarSelection } from "./use-calendar-selection";

export type CalendarProps = Omit<
  PropsBase,
  "components" | "endMonth" | "locale" | "mode" | "required" | "startMonth"
> & {
  defaultSelected?: Date[];
  enableDragSelection?: boolean;
  endDate?: Date;
  locale?: Locale;
  onSelect?: (dates: Date[]) => void;
  selected?: Date[];
  startDate?: Date;
};

type CalendarNavButtonProps = ComponentProps<"button">;

function toCalendarDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function createCalendarNavButton(icon: "chevron_left" | "chevron_right") {
  return function CalendarNavButton({
    className,
    type = "button",
    ...props
  }: CalendarNavButtonProps) {
    return (
      <IconButton
        {...props}
        // react-day-picker가 넘기는 영어 이름("Go to the Previous Month") 대신 한국어 이름을 쓴다.
        aria-label={icon === "chevron_left" ? "이전 달" : "다음 달"}
        size="sm"
        variant="clear"
        type={type}
        className={className}
      >
        <Icon type={icon} size="md" className="relative z-1" />
      </IconButton>
    );
  };
}

const CalendarNextMonthButton = createCalendarNavButton("chevron_right");
const CalendarPreviousMonthButton = createCalendarNavButton("chevron_left");

export function Calendar({
  className,
  classNames,
  defaultSelected,
  disabled,
  enableDragSelection = true,
  endDate,
  formatters,
  id,
  locale = ko,
  onDayClick,
  onDayMouseEnter,
  onSelect,
  selected,
  showOutsideDays = true,
  startDate,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const generatedCalendarId = useId();
  const calendarId = id ?? generatedCalendarId;

  const {
    handleDayMouseEnter: onCalendarDayMouseEnter,
    handleSelect,
    selectedDates,
  } = useCalendarSelection({
    calendarId,
    defaultSelected,
    enableDragSelection,
    onDayMouseEnter,
    onSelect,
    selected,
  });

  const normalizedStartDate = startDate ? toCalendarDate(startDate) : undefined;
  const normalizedEndDate = endDate ? toCalendarDate(endDate) : undefined;

  const minDate =
    normalizedStartDate &&
    normalizedEndDate &&
    normalizedStartDate.getTime() > normalizedEndDate.getTime()
      ? normalizedEndDate
      : normalizedStartDate;
  const maxDate =
    normalizedStartDate &&
    normalizedEndDate &&
    normalizedStartDate.getTime() > normalizedEndDate.getTime()
      ? normalizedStartDate
      : normalizedEndDate;

  const rangeDisabled: Matcher[] = [];

  if (minDate) {
    rangeDisabled.push({ before: minDate });
  }

  if (maxDate) {
    rangeDisabled.push({ after: maxDate });
  }

  const mergedDisabled =
    rangeDisabled.length === 0
      ? disabled
      : disabled === undefined
        ? rangeDisabled
        : Array.isArray(disabled)
          ? [...disabled, ...rangeDisabled]
          : [disabled, ...rangeDisabled];

  return (
    <DayPicker
      {...props}
      components={{
        NextMonthButton: CalendarNextMonthButton,
        PreviousMonthButton: CalendarPreviousMonthButton,
      }}
      disabled={mergedDisabled}
      formatters={{
        formatCaption: (displayMonth) =>
          format(displayMonth, "yyyy년 M월", { locale }),
        ...formatters,
      }}
      endMonth={maxDate ? toMonth(maxDate) : undefined}
      id={calendarId}
      locale={locale}
      mode="multiple"
      onDayClick={onDayClick}
      onDayMouseEnter={onCalendarDayMouseEnter}
      onSelect={handleSelect}
      selected={selectedDates}
      showOutsideDays={showOutsideDays}
      startMonth={minDate ? toMonth(minDate) : undefined}
      className={cn("select-none", className)}
      classNames={getCalendarClassNames({ classNames, defaultClassNames })}
    />
  );
}
