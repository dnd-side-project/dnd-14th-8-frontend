import type { Meta, StoryObj } from "@storybook/react";
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
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Timetable>;

const getDates = (count: number) => {
  const start = new Date("2025-02-18T00:00:00.000Z");
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

// 공통 기본 시간 설정
const defaultTimeArgs = {
  startTime: 9,
  endTime: 13,
};

/** 1일 보기 (일간) */
export const OneDay: Story = {
  name: "1일",
  args: {
    ...defaultTimeArgs,
    dates: getDates(1),
  },
};

/** 2일 보기 */
export const TwoDays: Story = {
  name: "2일",
  args: {
    ...defaultTimeArgs,
    dates: getDates(2),
  },
};

/** 3일 보기 */
export const ThreeDays: Story = {
  name: "3일",
  args: {
    ...defaultTimeArgs,
    dates: getDates(3),
  },
};

/** 4일 보기 */
export const FourDays: Story = {
  name: "4일",
  args: {
    ...defaultTimeArgs,
    dates: getDates(4),
  },
};

/** 7일 보기 (주간) */
export const Weekly: Story = {
  name: "7일",
  args: {
    ...defaultTimeArgs,
    dates: getDates(7),
  },
};
