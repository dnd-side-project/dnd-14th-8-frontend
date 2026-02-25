import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CardLocationMember } from ".";

const meta = {
  title: "domains/location/CardLocationMember",
  component: CardLocationMember,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof CardLocationMember>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "김수빈",
    address: "서울시 강남구 역삼동",
    durationMinutes: 87,
  },
};

export const Showcase: Story = {
  args: {
    name: "김수빈",
    address: "서울시 강남구 역삼동",
    durationMinutes: 87,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <CardLocationMember
        name="김수빈"
        address="서울시 강남구 역삼동"
        durationMinutes={87}
      />
      <CardLocationMember
        name="이영희"
        address="서울시 마포구 합정동"
        durationMinutes={52}
      />
      <CardLocationMember
        name="박철수"
        address="서울시 송파구 잠실동"
        durationMinutes={70}
      />
    </div>
  ),
};
