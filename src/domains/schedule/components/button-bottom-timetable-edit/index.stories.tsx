import type { Meta, StoryObj } from "@storybook/react";
import { ButtonBottomTimetableEdit } from "@/domains/schedule/components/button-bottom-timetable-edit";

const meta = {
  title: "domains/schedule/ButtonButtomTimetableEdit",
  component: ButtonBottomTimetableEdit,
  args: {
    children: "저장하기",
    description: "최대 30일, 0 ~ 24시까지 선택가능해요.",
    variant: "black",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonBottomTimetableEdit>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BlackStates: Story = {
  render: (args) => (
    <div className="flex w-full flex-col">
      <div className="border-k-50 border-b py-2 text-center text-k-400 text-xs">
        Default
      </div>
      <ButtonBottomTimetableEdit {...args} id="black-default" />

      <div className="border-k-50 border-b py-2 text-center text-k-400 text-xs">
        Hover
      </div>
      <ButtonBottomTimetableEdit {...args} id="black-hover" />

      <div className="border-k-50 border-b py-2 text-center text-k-400 text-xs">
        Pressed
      </div>
      <ButtonBottomTimetableEdit {...args} id="black-pressed" />
    </div>
  ),
  parameters: {
    pseudo: {
      hover: "#black-hover",
      active: "#black-pressed",
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
