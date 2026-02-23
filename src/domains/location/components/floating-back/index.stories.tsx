import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { FloatingBack } from "@/domains/location/components/floating-back";

const meta: Meta<typeof FloatingBack> = {
  title: "domains/location/FloatingBack",
  component: FloatingBack,
  parameters: {
    layout: "centered",
  },
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FloatingBack>;

export const Default: Story = {};
