import type { Meta, StoryObj } from "@storybook/react";
import { ScheduleMainSummaryContent } from "@/domains/schedule/components/schedule-main-summary";

const toDates = (days: number[]) => days.map((day) => new Date(2026, 11, day));

/** Figma: HomeHeader */
const meta = {
  title: "domains/schedule/ScheduleMainSummary",
  component: ScheduleMainSummaryContent,
  args: {
    canEditRange: true,
    dates: toDates([24, 25]),
    endTime: "12:00",
    hostName: "김혜인",
    startTime: "09:00",
    votedParticipantCount: 3,
    onEditSchedule: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScheduleMainSummaryContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Host: Story = {};

export const Participant: Story = {
  args: {
    canEditRange: false,
  },
};

export const WithOverflowDates: Story = {
  args: {
    dates: toDates([24, 25, 27, 29, 30]),
  },
};
