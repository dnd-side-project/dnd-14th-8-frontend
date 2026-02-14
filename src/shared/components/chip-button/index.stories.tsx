import type { Meta, StoryObj } from "@storybook/react";
import { ChipButton } from "@/shared/components/chip-button";

const meta = {
  title: "shared/ChipButton",
  component: ChipButton,
  args: {
    children: "수정",
    size: "sm",
    variant: "primary",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChipButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-wrap items-center gap-2">
      <ChipButton size="sm" variant="outlined">
        4-10
      </ChipButton>
      <ChipButton size="md" variant="outlined">
        8-14
      </ChipButton>
      <ChipButton size="lg" variant="outlined">
        10-12
      </ChipButton>
    </div>
  ),
};

export const Designs: Story = {
  render: () => (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton id="chip-reset-default" size="lg" variant="ghost">
          초기화
        </ChipButton>
        <ChipButton id="chip-reset-hover" size="lg" variant="ghost">
          초기화
        </ChipButton>
        <ChipButton id="chip-reset-pressed" size="lg" variant="ghost">
          초기화
        </ChipButton>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton size="sm" variant="primary">
          수정
        </ChipButton>
        <ChipButton id="chip-primary-hover" size="sm" variant="primary">
          수정
        </ChipButton>
        <ChipButton id="chip-primary-pressed" size="sm" variant="primary">
          수정
        </ChipButton>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton size="md" variant="selected">
          text
        </ChipButton>
        <ChipButton size="md" variant="outlined">
          text
        </ChipButton>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover: "#chip-primary-hover, #chip-reset-hover",
      active: "#chip-primary-pressed, #chip-reset-pressed",
    },
  },
};
