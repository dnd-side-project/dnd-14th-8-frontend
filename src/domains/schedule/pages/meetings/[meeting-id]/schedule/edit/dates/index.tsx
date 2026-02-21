import { addDays, isSameDay, startOfDay } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ButtonBottomTimetableEdit } from "@/domains/schedule/components/button-buttom-timetable-edit";
import { Calendar } from "@/shared/components/calendar";
import { ChipButton } from "@/shared/components/chip-button";
import { Dropdown, DropdownOption } from "@/shared/components/dropdown";
import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { useLockBodyScroll } from "@/shared/hooks/use-lock-body-scroll";

const areDatesEqual = (datesA: Date[], datesB: Date[]) => {
  if (datesA.length !== datesB.length) return false;

  const sortedA = [...datesA].sort((a, b) => a.getTime() - b.getTime());
  const sortedB = [...datesB].sort((a, b) => a.getTime() - b.getTime());

  return sortedA.every((date, index) => isSameDay(date, sortedB[index]));
};

const getNextDays = (count: number) => {
  const today = startOfDay(new Date());
  return Array.from({ length: count }, (_, i) => addDays(today, i));
};

export function ScheduleEditDatesPage() {
  const navigate = useNavigate();
  useLockBodyScroll();

  const today = startOfDay(new Date());

  // 플로우에 맞게 기본값 수정
  const [selectedDates, setSelectedDates] = useState<Date[]>(getNextDays(4));

  const datePresets = [
    { label: "오늘부터 7일", dates: getNextDays(7) },
    { label: "오늘부터 14일", dates: getNextDays(14) },
    { label: "오늘부터 30일", dates: getNextDays(30) },
  ];

  const _getActivePresetLabel = () => {
    const matchedPreset = datePresets.find((preset) =>
      areDatesEqual(selectedDates, preset.dates),
    );
    return matchedPreset ? matchedPreset.label : null;
  };

  // 플로우에 맞게 기본값 수정
  const [startTime, setStartTime] = useState("21:30");
  const [endTime, setEndTime] = useState("23:00");

  const timeOptions = Array.from({ length: 49 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  const timePresets = [
    { label: "9시 ~ 18시", start: "09:00", end: "18:00" },
    { label: "18시 ~ 06시", start: "18:00", end: "06:00" },
    { label: "9시 ~ 24시", start: "09:00", end: "24:00" },
  ];

  const handleTimePresetClick = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  return (
    <MobileLayout>
      <div className="fixed inset-0 z-10 flex touch-none items-end bg-k-900/40">
        <button
          aria-label="시간표 기간 편집 닫기"
          className="absolute inset-0"
          onClick={() => navigate("..")}
          type="button"
        />

        <section className="relative z-10 mx-auto flex h-[calc(100dvh-28px)] w-full touch-auto flex-col rounded-t-2xl bg-k-5">
          <div className="w-full shrink-0 border-b border-b-k-50 py-3">
            <div className="mx-auto flex max-w-[335px] items-center justify-between">
              <h2 className="text-k-900 text-t1">시간표 선택범위</h2>
              <IconButton
                icon={CloseIcon}
                size="lg"
                background="circle"
                backgroundSize="sm"
                iconSize="sm"
                variant="neutral"
                onClick={() => navigate("..")}
              />
            </div>
          </div>

          <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-[335px]">
              <h2 className="mt-5 mb-1 text-k-900 text-t2">날짜</h2>
              <div className="flex w-full justify-start overflow-hidden">
                <Calendar
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  startDate={today}
                />
              </div>
              <div className="mt-5 mb-20 flex justify-start gap-2">
                {datePresets.map((preset) => (
                  <ChipButton
                    key={preset.label}
                    size="md"
                    variant={
                      areDatesEqual(selectedDates, preset.dates)
                        ? "selected"
                        : "outlined"
                    }
                    onClick={() => setSelectedDates(preset.dates)}
                  >
                    {preset.label}
                  </ChipButton>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[335px]">
              <h2 className="mb-3 text-b3 text-k-900">시간범위</h2>
              <div className="flex items-center gap-[6px]">
                <Dropdown
                  value={startTime}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setStartTime(e.target.value)
                  }
                >
                  {timeOptions.map((time) => (
                    <DropdownOption key={`start-${time}`} value={time}>
                      {time}
                    </DropdownOption>
                  ))}
                </Dropdown>
                <span className="text-k-200">-</span>
                <Dropdown
                  value={endTime}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEndTime(e.target.value)
                  }
                >
                  {timeOptions.map((time) => (
                    <DropdownOption key={`end-${time}`} value={time}>
                      {time}
                    </DropdownOption>
                  ))}
                </Dropdown>
              </div>
              <div className="mt-5 mb-20 flex justify-start gap-2">
                {timePresets.map((preset) => (
                  <ChipButton
                    key={preset.label}
                    size="md"
                    variant={
                      startTime === preset.start && endTime === preset.end
                        ? "selected"
                        : "outlined"
                    }
                    onClick={() =>
                      handleTimePresetClick(preset.start, preset.end)
                    }
                  >
                    {preset.label}
                  </ChipButton>
                ))}
              </div>
            </div>
          </div>

          <ButtonBottomTimetableEdit
            className="mx-auto my-3 w-full max-w-[335px] shrink-0 pb-[safe-area-inset-bottom]"
            description="최대 30일, 0 ~ 24시까지 선택가능해요."
            onClick={() => {
              // 저장 로직 추가
              navigate("..");
            }}
          >
            저장하기
          </ButtonBottomTimetableEdit>
        </section>
      </div>
    </MobileLayout>
  );
}
