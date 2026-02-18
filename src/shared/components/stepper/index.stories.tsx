import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Stepper } from "@/shared/components/stepper";

const meta = {
  title: "shared/Stepper",
  component: Stepper,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(2);
    return <Stepper label="인원 수" value={v} onChange={setV} />;
  },
};
