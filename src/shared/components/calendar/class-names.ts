import type {
  DayPickerProps,
  getDefaultClassNames,
  PropsBase,
} from "react-day-picker";
import { cn } from "@/shared/utils/cn";

type CalendarClassNamesParams = {
  classNames?: PropsBase["classNames"];
  defaultClassNames: ReturnType<typeof getDefaultClassNames>;
};

const buttonBaseClassName = cn(
  "relative isolate text-k-700 aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-k-200",
);

export function getCalendarClassNames({
  classNames,
  defaultClassNames,
}: CalendarClassNamesParams): DayPickerProps["classNames"] {
  return {
    root: cn("w-[335px]", defaultClassNames.root),
    months: cn("relative w-full", defaultClassNames.months),
    month: cn("w-full", defaultClassNames.month),
    month_caption: cn(
      "relative flex h-11 items-center justify-start",
      defaultClassNames.month_caption,
    ),
    caption_label: cn("text-k-700 text-t2", defaultClassNames.caption_label),
    nav: cn(
      "absolute top-[18px] right-[6px] z-1 flex -translate-y-1/2 items-center gap-1",
      defaultClassNames.nav,
    ),
    button_previous: cn(buttonBaseClassName, defaultClassNames.button_previous),
    button_next: cn(buttonBaseClassName, defaultClassNames.button_next),
    month_grid: cn(
      "w-full table-fixed border-collapse",
      defaultClassNames.month_grid,
    ),
    weekdays: cn("h-11", defaultClassNames.weekdays),
    weekday: cn(
      "h-11 p-0 text-center align-middle text-b4 text-k-500",
      defaultClassNames.weekday,
    ),
    week: cn("h-11", defaultClassNames.week),
    day: cn(
      "group/day relative h-11 p-0 text-center align-middle text-k-900 before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:size-10 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0.96] before:rounded-lg before:bg-primary-main before:opacity-0 before:transition-[transform,opacity] before:duration-140 before:ease-[cubic-bezier(0.2,0.8,0.2,1)] data-[disabled=true]:text-k-200 data-[outside=true]:text-k-200 data-[selected=true]:before:scale-100 data-[selected=true]:before:opacity-100",
      defaultClassNames.day,
    ),
    day_button: cn(
      "relative z-1 mx-auto inline-flex size-10 cursor-pointer items-center justify-center rounded-lg p-0 text-b2 outline-none transition-colors focus:outline-none focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 disabled:cursor-default disabled:text-k-200 aria-disabled:cursor-default aria-disabled:text-k-200 group-data-[selected=true]/day:text-k-5",
      defaultClassNames.day_button,
    ),
    outside: defaultClassNames.outside,
    disabled: defaultClassNames.disabled,
    hidden: cn("invisible", defaultClassNames.hidden),
    ...classNames,
  };
}
