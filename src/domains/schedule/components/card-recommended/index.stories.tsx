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
    date: {
      from: new Date(2024, 11, 25, 14, 0), // 2024년 12월 25일 14:00
      to: new Date(2024, 11, 25, 16, 30), // 2024년 12월 25일 16:30
    },
    participants: [
      { name: "김철수", isAvailable: true },
      { name: "이영희", isAvailable: true },
      { name: "박민수", isAvailable: false },
      { name: "정소영", isAvailable: true },
      { name: "최준호", isAvailable: false },
    ],
  },
};

export const Expanded: Story = {
  args: { ...Default.args, expanded: true },
};

export const EmptyParticipants: Story = {
  args: {
    ...Default.args,
    participants: [],
  },
};
