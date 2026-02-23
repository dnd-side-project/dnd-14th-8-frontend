import type { Meta, StoryObj } from "@storybook/react";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { TargetIcon } from "@/shared/components/icons";

const meta = {
  title: "domains/location/ButtonSubStroke",
  component: ButtonSubStroke,
  args: { children: "Button", icon: <TargetIcon /> },
  argTypes: { icon: { control: false } },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonSubStroke>;

export default meta;

type Story = StoryObj<typeof meta>;

const icon = <TargetIcon />;

export const States: Story = {
  render: () => {
    return (
      <div className="flex w-full flex-col gap-2">
        <ButtonSubStroke>출발지 추가하기</ButtonSubStroke>
        <ButtonSubStroke icon={icon}>현 위치 불러오기</ButtonSubStroke>
      </div>
    );
  },
};
