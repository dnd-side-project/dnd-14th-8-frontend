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
      <ChipButton size="xs" variant="outlined">
        2-6
      </ChipButton>
      <ChipButton size="sm" variant="outlined">
        4-10
      </ChipButton>
      <ChipButton size="md" variant="outlined">
        6-12
      </ChipButton>
      <ChipButton size="lg" variant="outlined">
        8-14
      </ChipButton>
      <ChipButton size="xl" variant="outlined">
        10-12
      </ChipButton>
    </div>
  ),
};

export const Designs: Story = {
  render: () => (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton id="chip-reset-default" size="xl" variant="ghost">
          초기화
        </ChipButton>
        <ChipButton id="chip-reset-hover" size="xl" variant="ghost">
          초기화
        </ChipButton>
        <ChipButton id="chip-reset-pressed" size="xl" variant="ghost">
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
        <ChipButton size="lg" variant="selected">
          text
        </ChipButton>
        <ChipButton size="lg" variant="outlined">
          text
        </ChipButton>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton size="lg" variant="floatingSelected">
          location
        </ChipButton>
        <ChipButton size="lg" variant="floating">
          location
        </ChipButton>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton size="md" variant="midpointSelected">
          location
        </ChipButton>
        <ChipButton size="md" variant="midpoint">
          location
        </ChipButton>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton id="chip-edit-default" size="xs" variant="ghost">
          수정
        </ChipButton>
        <ChipButton id="chip-edit-hover" size="xs" variant="ghost">
          수정
        </ChipButton>
        <ChipButton id="chip-edit-pressed" size="xs" variant="ghost">
          수정
        </ChipButton>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2">
        <ChipButton id="chip-delete-default" size="xs" variant="locationDelete">
          삭제
        </ChipButton>
        <ChipButton id="chip-delete-hover" size="xs" variant="locationDelete">
          삭제
        </ChipButton>
        <ChipButton id="chip-delete-pressed" size="xs" variant="locationDelete">
          삭제
        </ChipButton>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover:
        "#chip-primary-hover, #chip-reset-hover, #chip-edit-hover, #chip-delete-hover",
      active:
        "#chip-primary-pressed, #chip-reset-pressed, #chip-edit-pressed, #chip-delete-pressed",
    },
  },
};
