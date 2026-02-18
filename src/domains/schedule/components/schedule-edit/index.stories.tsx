import type { Meta, StoryObj } from "@storybook/react";
import { ScheduleEdit } from "@/domains/schedule/components/schedule-edit";

const toDates = (days: number[]) => days.map((day) => new Date(2026, 11, day));

const meta = {
  title: "domains/schedule/ScheduleEdit",
  component: ScheduleEdit,
  args: {
    dates: toDates([24, 25, 26, 27, 28]),
    endTime: "24:30",
    startTime: "22:30",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScheduleEdit>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NonConsecutiveWithOverflow: Story = {
  args: {
    dates: toDates([24, 26, 28, 30]),
  },
};

export const ConsecutiveWithOverflow: Story = {
  args: {
    dates: toDates([24, 25, 26, 28, 30]),
  },
};

export const SingleDate: Story = {
  args: {
    dates: toDates([24]),
  },
};
