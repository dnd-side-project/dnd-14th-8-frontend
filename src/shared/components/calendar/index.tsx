import { format } from "date-fns";
import type { Locale } from "date-fns/locale";
import { ko } from "date-fns/locale";
import { type ComponentProps, useId } from "react";
import type { Matcher, PropsBase } from "react-day-picker";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { IconButton } from "@/shared/components/icon-button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/icons";
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

function createCalendarNavButton(icon: typeof ChevronLeftIcon) {
  return function CalendarNavButton({
    className,
    type = "button",
    ...props
  }: CalendarNavButtonProps) {
    return (
      <IconButton
        {...props}
        size="md"
        background="square"
        backgroundSize="sm"
        icon={icon}
        iconSize="lg"
        iconClassName="relative z-1"
        type={type}
        variant="subtle"
        className={className}
      />
    );
  };
}

const CalendarNextMonthButton = createCalendarNavButton(ChevronRightIcon);
const CalendarPreviousMonthButton = createCalendarNavButton(ChevronLeftIcon);

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
