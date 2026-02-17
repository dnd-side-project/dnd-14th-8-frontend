import type { Meta, StoryObj } from "@storybook/react";
import { TimetableSlot } from "@/shared/components/timetable-slot";

const meta: Meta<typeof TimetableSlot> = {
  title: "shared/TimetableSlot",
  component: TimetableSlot,
  argTypes: {
    isSelected: {
      control: "boolean",
      description: "슬롯의 선택 여부 (Pressed 상태)",
    },
    onClick: { action: "clicked" },
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TimetableSlot>;

export const AllStates: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-gray-400 text-xs">Default</span>
        <TimetableSlot {...args} isSelected={false} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-gray-400 text-xs">Selected</span>
        <TimetableSlot {...args} isSelected={true} />
      </div>
    </div>
  ),
};
