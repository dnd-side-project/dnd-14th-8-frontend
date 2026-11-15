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

// 출발지에 긴 장소 이름이 들어와도 칩 안에서 말줄임해 소요 시간을 덮지 않는다(#230).
export const LongAddress: Story = {
  args: {
    name: "김수빈",
    address: "청주시청 (2029년 3월 예정) 임시청사 민원실 앞 버스정류장",
    durationMinutes: 87,
  },
};
