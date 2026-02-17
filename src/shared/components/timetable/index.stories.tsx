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

// 오늘부터 7일간의 날짜 생성 함수
const getDates = (count: number) => {
  const start = new Date();
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

/**
 * 기본 사용 예시 (3일 분량)
 */
export const Default: Story = {
  args: {
    dates: getDates(3),
    startTime: 9,
    endTime: 18,
  },
};

/**
 * 일주일 전체 보기 (7일)
 */
export const Weekly: Story = {
  args: {
    dates: getDates(7),
    startTime: 9,
    endTime: 22,
  },
};

/**
 * 24시간 전체 표시
 */
export const FullDay: Story = {
  args: {
    dates: getDates(1),
    startTime: 0,
    endTime: 24,
  },
};
