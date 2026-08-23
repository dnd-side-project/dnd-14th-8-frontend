import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "@storybook/test";
import { useState } from "react";
import { Timetable } from "@/shared/components/timetable";

const meta: Meta<typeof Timetable> = {
  title: "shared/Timetable",
  component: Timetable,
  argTypes: {
    startTime: {
      control: { type: "number", min: 0, max: 23 },
      description: "시작 시간 (24시간제)",
    },
    endTime: {
      control: { type: "number", min: 1, max: 24 },
      description: "종료 시간 (24시간제)",
    },
    disabled: {
      control: "boolean",
      description: "뷰어 모드 (상호작용 차단)",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Timetable>;

// 테스트용 날짜 생성 유틸
const getDates = (count: number) => {
  const start = new Date("2026-02-18T00:00:00.000Z");
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

// 인원수 농도 테스트를 위한 가상 데이터 생성
const mockOccupancy: Record<string, number> = {};
const dates = getDates(7);
dates.forEach((date, dateIdx) => {
  // 각 날짜의 10시~12시 구간에 1명~3명 사이의 인원수 임의 할당
  [10, 11].forEach((hour) => {
    [0, 30].forEach((min) => {
      const d = new Date(date);
      d.setHours(hour, min, 0, 0);
      // 날짜별로 인원수 종류(N)가 다르게 보이도록 설정
      mockOccupancy[d.getTime().toString()] = (dateIdx % 3) + 1;
    });
  });
});

/** 1. 대화형 선택 테스트 (기본) */
export const Interactive: Story = {
  name: "직접 선택하기",
  render: (args) => {
    const [selected, setSelected] = useState<Date[]>([]);
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium text-k-500 text-sm">
          드래그하여 시간을 선택해보세요. (선택된 슬롯: {selected.length}개)
        </p>
        <Timetable {...args} selected={selected} onSelect={setSelected} />
      </div>
    );
  },
  args: {
    startTime: 9,
    endTime: 23,
    dates: getDates(8),
  },
};

/** 2. 뷰어 모드 및 팀원 일정 확인 (N=3 상황 재현) */
export const ViewerMode: Story = {
  name: "뷰어 모드",
  args: {
    startTime: 9,
    endTime: 18,
    dates: getDates(5),
    disabled: true, // 상호작용 차단
    occupancy: mockOccupancy, // k/N 농도 데이터 주입
  },
};

/** 3. 주간 뷰 (7일) */
export const Weekly: Story = {
  name: "주간 뷰",
  args: {
    startTime: 9,
    endTime: 24,
    dates: getDates(7),
    occupancy: mockOccupancy,
  },
};

/** 4. 30분 단위 시작/종료 (21:30 ~ 23:00) */
export const HalfHourBoundary: Story = {
  name: "30분 단위 (21:30~23:00)",
  render: (args) => {
    const [selected, setSelected] = useState<Date[]>([]);
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium text-k-500 text-sm">
          21:30 시작 · 선택된 슬롯: {selected.length}개
        </p>
        <Timetable {...args} selected={selected} onSelect={setSelected} />
      </div>
    );
  },
  args: {
    startTime: 21.5,
    endTime: 23,
    dates: getDates(5),
  },
};

/** 5. 30분 단위 시작 + 30분 단위 종료 (9:30 ~ 18:30) */
export const HalfHourBoth: Story = {
  name: "30분 단위 양쪽 (9:30~18:30)",
  render: (args) => {
    const [selected, setSelected] = useState<Date[]>([]);
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium text-k-500 text-sm">
          9:30 ~ 18:30 · 선택된 슬롯: {selected.length}개
        </p>
        <Timetable {...args} selected={selected} onSelect={setSelected} />
      </div>
    );
  },
  args: {
    startTime: 9.5,
    endTime: 18.5,
    dates: getDates(4),
  },
};

/**
 * 6. 읽기 전용 시간표의 탭 처리
 *
 * 메인 화면 시간표는 읽기 전용이지만, 사용자는 "내 시간을 넣으려고" 격자를
 * 누른다. 그 탭을 편집 화면으로 연결하되 스크롤 제스처와는 구분해야 한다.
 */
const readOnlyTapArgs = {
  startTime: 9,
  endTime: 11,
  dates: getDates(3),
  disabled: true,
};

const getSlot = (
  canvasElement: HTMLElement,
  dateIdx: number,
  slotIdx: number,
) => {
  const slot = canvasElement.querySelector<HTMLElement>(
    `[data-date-idx="${dateIdx}"][data-slot-idx="${slotIdx}"]`,
  );
  if (!slot) throw new Error(`슬롯을 찾지 못했어요: ${dateIdx}/${slotIdx}`);
  return slot;
};

export const ReadOnlyTap: Story = {
  name: "읽기 전용 · 탭하면 편집으로",
  args: { ...readOnlyTapArgs, onDisabledTap: fn(), onSelect: fn() },
  play: async ({ args, canvasElement }) => {
    const slot = getSlot(canvasElement, 1, 2);

    await userEvent.pointer([
      {
        keys: "[MouseLeft>]",
        target: slot,
        coords: { clientX: 120, clientY: 300 },
      },
      {
        keys: "[/MouseLeft]",
        target: slot,
        coords: { clientX: 122, clientY: 301 },
      },
    ]);

    await expect(args.onDisabledTap).toHaveBeenCalledTimes(1);
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

export const ReadOnlyDrag: Story = {
  name: "읽기 전용 · 스크롤 제스처는 무시",
  args: { ...readOnlyTapArgs, onDisabledTap: fn(), onSelect: fn() },
  play: async ({ args, canvasElement }) => {
    const from = getSlot(canvasElement, 0, 2);
    const to = getSlot(canvasElement, 2, 2);

    await userEvent.pointer([
      {
        keys: "[MouseLeft>]",
        target: from,
        coords: { clientX: 220, clientY: 300 },
      },
      { target: to, coords: { clientX: 120, clientY: 302 } },
      {
        keys: "[/MouseLeft]",
        target: to,
        coords: { clientX: 120, clientY: 302 },
      },
    ]);

    await expect(args.onDisabledTap).not.toHaveBeenCalled();
  },
};

export const ReadOnlyWithoutTapHandler: Story = {
  name: "읽기 전용 · 핸들러 없으면 종전대로 무반응",
  args: { ...readOnlyTapArgs, onSelect: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(getSlot(canvasElement, 1, 2));

    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};
