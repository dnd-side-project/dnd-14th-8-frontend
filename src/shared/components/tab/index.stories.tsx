import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tab } from ".";

const meta: Meta<typeof Tab> = {
  title: "shared/Tab",
  component: Tab,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tab>;

export const ScheduleTab: Story = {
  render: () => {
    const [idx, setIdx] = useState(0);
    return (
      <Tab items={["시간표", "추천일정"]} activeIndex={idx} onChange={setIdx} />
    );
  },
};

export const MemberTab: Story = {
  render: () => {
    const [idx, setIdx] = useState(0);
    return (
      <Tab items={["시간표", "가능시간"]} activeIndex={idx} onChange={setIdx} />
    );
  },
};

export const TransportTab: Story = {
  render: () => {
    const [idx, setIdx] = useState(0);
    return (
      <Tab items={["대중교통", "자동차"]} activeIndex={idx} onChange={setIdx} />
    );
  },
};
