import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO, startOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ButtonBottomTimetableEdit } from "@/domains/schedule/components/button-bottom-timetable-edit";
import {
  DATE_PRESETS,
  TIME_PRESETS,
} from "@/domains/schedule/constants/poll-options-presets";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { useUpdateSchedulePoll } from "@/domains/schedule/hooks/use-update-schedule-poll";
import { areDatesEqual, timeOptions } from "@/domains/schedule/utils/date";
import { Calendar } from "@/shared/components/calendar";
import { ChipButton } from "@/shared/components/chip-button";
import { Dropdown, DropdownOption } from "@/shared/components/dropdown";
import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { Modal } from "@/shared/components/modal";
import { toast } from "@/shared/components/toast";
import { useLockBodyScroll } from "@/shared/hooks/use-lock-body-scroll";

export function ScheduleEditDatesPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useLockBodyScroll();

  const today = startOfDay(new Date());

  const { data: initialData, isLoading } = useGetMeetingSchedules({
    meetingId: meetingId || "",
  });
  const { mutate: updateSchedule, isPending } = useUpdateSchedulePoll();

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("24:00");
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      const dates = initialData.dateOptions.map((d: string) => parseISO(d));
      setSelectedDates(dates);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);

      if (dates.length > 0) {
        const earliestDate = new Date(
          Math.min(...dates.map((d) => d.getTime())),
        );
        setCurrentMonth(
          new Date(earliestDate.getFullYear(), earliestDate.getMonth()),
        );
      }
    }
  }, [initialData]);

  const isDirty = useMemo(() => {
    if (!initialData) return false;

    const initialDates = initialData.dateOptions.map((d: string) =>
      parseISO(d),
    );
    const isDateChanged = !areDatesEqual(initialDates, selectedDates);
    const isTimeChanged =
      startTime !== initialData.startTime || endTime !== initialData.endTime;

    return isDateChanged || isTimeChanged;
  }, [selectedDates, startTime, endTime, initialData]);

  const requestUpdate = () => {
    if (!meetingId) return;

    const payload = {
      dateOptions: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
      startTime,
      endTime,
    };

    updateSchedule(
      { meetingId, payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["meeting", "schedules", meetingId],
          });
          navigate("..");
          toast.success("수정 완료되었어요!");
        },
        onError: () => {
          alert("일정 수정에 실패했습니다.");
        },
      },
    );
  };

  const handleSave = () => {
    if (!meetingId || !isDirty || selectedDates.length === 0 || isPending)
      return;

    // 투표한 인원이 1명이라도 있으면 확인 모달 오픈
    if (initialData && initialData.votedParticipantCount >= 1) {
      setIsConfirmModalOpen(true);
    } else {
      requestUpdate();
    }
  };

  const handleTimePresetClick = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleRequestClose = () => {
    if (isDirty) {
      setIsExitModalOpen(true);
    } else {
      navigate("..");
    }
  };

  if (isLoading) return null;

  return (
    <MobileLayout>
      <div className="fixed inset-0 z-50 flex touch-none items-end bg-k-900/40">
        <button
          aria-label="시간표 기간 편집 닫기"
          className="absolute inset-0"
          onClick={handleRequestClose}
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
                onClick={handleRequestClose}
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
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                />
              </div>
              <div className="mt-5 mb-20 flex justify-start gap-2">
                {DATE_PRESETS.map((preset) => (
                  <ChipButton
                    key={preset.label}
                    size="md"
                    variant={
                      areDatesEqual(selectedDates, preset.dates)
                        ? "selected"
                        : "outlined"
                    }
                    onClick={() => {
                      setSelectedDates(preset.dates);
                      setCurrentMonth(today);
                    }}
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
                  onChange={(e) => setStartTime(e.target.value)}
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
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <DropdownOption key={`end-${time}`} value={time}>
                      {time}
                    </DropdownOption>
                  ))}
                </Dropdown>
              </div>
              <div className="mt-5 mb-20 flex justify-start gap-2">
                {TIME_PRESETS.map((preset) => (
                  <ChipButton
                    key={preset.label}
                    size="lg"
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
            className="mx-auto my-3 w-full max-w-[335px] shrink-0"
            description="최대 30일, 0 ~ 24시까지 선택가능해요."
            disabled={!isDirty || isPending || selectedDates.length === 0}
            onClick={handleSave}
          >
            {isPending ? "저장 중..." : "저장하기"}
          </ButtonBottomTimetableEdit>
        </section>
      </div>

      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        title="저장하지 않고 나가시겠어요?"
        caption="수정한 내용이 모두 사라져요."
        secondaryButton={{
          label: "취소",
          color: "gray",
          onClick: () => setIsExitModalOpen(false),
        }}
        primaryButton={{
          label: "나가기",
          color: "blue",
          onClick: () => {
            setIsExitModalOpen(false);
            navigate("..");
          },
        }}
      />

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="시간표 범위를 수정할까요?"
        caption={`기존에 등록된 일정 중 변경된 범위에 포함되지\n않는 시간은 자동으로 삭제돼요.`}
        secondaryButton={{
          label: "취소",
          color: "gray",
          onClick: () => {
            setIsConfirmModalOpen(false);
            navigate("..");
          },
        }}
        primaryButton={{
          label: "변경하기",
          color: "blue",
          onClick: () => {
            setIsConfirmModalOpen(false);
            requestUpdate();
          },
        }}
      />
    </MobileLayout>
  );
}
