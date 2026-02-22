import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "@/shared/components/chip";

const meta = {
  title: "shared/Chip",
  component: Chip,
  args: { children: "text", size: "md" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl", "2xl"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OverflowSchedulesChip: Story = {
  args: {
    children: "+n",
    size: "sm",
  },
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex w-full items-end gap-3">
      <Chip size="sm">+n</Chip>
      <Chip size="md">address</Chip>
      <Chip size="lg">name</Chip>
      <Chip size="xl">text</Chip>
    </div>
  ),
};
