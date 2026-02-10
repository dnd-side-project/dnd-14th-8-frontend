import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Counter } from ".";

const meta: Meta<typeof Counter> = {
  title: "shared/Counter",
  component: Counter,
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

type Story = StoryObj<typeof Counter>;

/** 기본 (디자인 #5 — 모임 인원 선택) */
export const Default: Story = {
  render: () => {
    const [v, setV] = useState(2);
    return <Counter value={v} onChange={setV} />;
  },
};

/** 최솟값 도달 시 − 비활성 */
export const AtMinimum: Story = {
  render: () => {
    const [v, setV] = useState(2);
    return <Counter value={v} min={2} max={10} onChange={setV} />;
  },
};

/** 큰 값 */
export const HighValue: Story = {
  render: () => {
    const [v, setV] = useState(10);
    return <Counter value={v} min={2} max={50} onChange={setV} />;
  },
};
