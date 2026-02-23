import type { Meta, StoryObj } from "@storybook/react";
import { ButtonSubStorke } from "@/domains/location/components/button-sub-storke";
import { TargetIcon } from "@/shared/components/icons";

const meta = {
  title: "domains/location/ButtonSubStorke",
  component: ButtonSubStorke,
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
} satisfies Meta<typeof ButtonSubStorke>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => {
    const icon = <TargetIcon />;
    return (
      <div className="flex w-full flex-col gap-2">
        <ButtonSubStorke>출발지 추가하기</ButtonSubStorke>
        <ButtonSubStorke icon={icon}>현 위치 불러오기</ButtonSubStorke>
      </div>
    );
  },
};
