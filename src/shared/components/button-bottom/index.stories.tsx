import type { Meta, StoryObj } from "@storybook/react";
import { ButtonBottom } from "@/shared/components/button-bottom";

const meta = {
  title: "shared/ButtonBottom",
  component: ButtonBottom,
  args: { children: "Button", variant: "black" },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonBottom>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BlackStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      <ButtonBottom id="black-default" variant="black">
        Black / Default
      </ButtonBottom>
      <ButtonBottom id="black-hover" variant="black">
        Black / Hover
      </ButtonBottom>
      <ButtonBottom id="black-pressed" variant="black">
        Black / Pressed
      </ButtonBottom>
    </div>
  ),
  parameters: { pseudo: { active: "#black-pressed", hover: "#black-hover" } },
};

export const BlueStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      <ButtonBottom id="blue-default" variant="blue">
        Blue / Default
      </ButtonBottom>
      <ButtonBottom id="blue-hover" variant="blue">
        Blue / Hover
      </ButtonBottom>
      <ButtonBottom id="blue-pressed" variant="blue">
        Blue / Pressed
      </ButtonBottom>
    </div>
  ),
  parameters: { pseudo: { active: "#blue-pressed", hover: "#blue-hover" } },
};

export const WhiteStates: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2 bg-k-10 p-3">
      <ButtonBottom id="white-default" variant="white">
        White / Default
      </ButtonBottom>
      <ButtonBottom id="white-hover" variant="white">
        White / Hover
      </ButtonBottom>
      <ButtonBottom id="white-pressed" variant="white">
        White / Pressed
      </ButtonBottom>
    </div>
  ),
  parameters: { pseudo: { active: "#white-pressed", hover: "#white-hover" } },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};
