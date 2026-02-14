import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Stepper } from ".";

const meta: Meta<typeof Stepper> = {
  title: "shared/Stepper",
  component: Stepper,
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

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(2);
    return <Stepper value={v} onChange={setV} />;
  },
};
