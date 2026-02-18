import type { Meta, StoryObj } from "@storybook/react";
import { TimetableSlot } from "@/shared/components/timetable-slot";

const meta: Meta<typeof TimetableSlot> = {
  title: "shared/TimetableSlot",
  component: TimetableSlot,
  argTypes: {
    isSelected: {
      control: "boolean",
      description: "사용자 본인의 슬롯 선택 여부",
    },
    isDisabled: {
      control: "boolean",
      description: "뷰어 모드 (상호작용 차단) 여부",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "팀원 선택 인원수에 따른 농도 (0~1)",
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

// 1. 모든 상태 요약 (Default, Selected, Disabled)
export const AllStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-medium text-k-500 text-xs">Default</span>
          <TimetableSlot {...args} isSelected={false} isDisabled={false} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-medium text-k-500 text-xs">Selected</span>
          <TimetableSlot {...args} isSelected={true} isDisabled={false} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-medium text-k-500 text-xs">
            Disabled (Viewer)
          </span>
          <TimetableSlot {...args} isDisabled={true} />
        </div>
      </div>
    </div>
  ),
};

// 2. 인원수 종류(N)에 따른 농도 테스트 (이미지 로직 반영)
export const OccupancyGradients: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-k-700 text-sm">Occupancy Gradient (k/N)</h3>

      <div className="flex flex-col gap-2">
        <span className="text-k-500 text-xs">N=2 (1/2, 2/2)</span>
        <div className="flex gap-2">
          <TimetableSlot opacity={0.5} />
          <TimetableSlot opacity={1.0} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-k-500 text-xs">N=3 (1/3, 2/3, 3/3)</span>
        <div className="flex gap-2">
          <TimetableSlot opacity={0.33} />
          <TimetableSlot opacity={0.67} />
          <TimetableSlot opacity={1.0} />
        </div>
      </div>
    </div>
  ),
};
