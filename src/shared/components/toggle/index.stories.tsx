import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from ".";

const meta: Meta<typeof Toggle> = {
  title: "shared/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        label="가능한 시간 체크"
      />
    );
  },
};

export const On: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        label="가능한 시간 체크"
      />
    );
  },
};

export const NoLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Toggle checked={checked} onChange={setChecked} />;
  },
};
