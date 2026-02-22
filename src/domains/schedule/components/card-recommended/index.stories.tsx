import type { Meta, StoryObj } from "@storybook/react";
import { CardRecommended } from "@/domains/schedule/components/card-recommended";

const meta = {
  title: "domains/schedule/CardRecommended",
  component: CardRecommended,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof CardRecommended>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scheduleDate: "2026-02-22",
    scheduleDayOfWeek: "일요일",
    startTime: "11:00",
    endTime: "18:00",
    voteCount: 3,
    participantCount: 5,
    availableParticipantNames: ["김수빈", "이영희", "정소영"],
    unavailableParticipantNames: ["김철수", "최준호"],
  },
};

export const Expanded: Story = {
  args: { ...Default.args, expanded: true },
};

export const EmptyParticipants: Story = {
  args: {
    ...Default.args,
    voteCount: 0,
    availableParticipantNames: [],
    unavailableParticipantNames: [],
  },
};
