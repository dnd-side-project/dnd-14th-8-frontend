import type { Meta, StoryObj } from "@storybook/react";
import { CardTraffic } from ".";

const meta = {
  title: "domains/location/CardTraffic",
  component: CardTraffic,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: {},
} satisfies Meta<typeof CardTraffic>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    departure: "서울시 강남구",
    arrival: "서울 2호선 선릉역",
    distanceMeters: 12_400,
    durationMinutes: 90,
    trafficGuides: [
      { label: "요금", value: "약 8,000원" },
      { label: "환승", value: "2회" },
    ],
  },
};

// 출발지에 긴 장소 이름이 들어와도 도착역과 거리는 보이고 출발지만 말줄임한다(#230).
export const LongDeparture: Story = {
  args: {
    ...Default.args,
    departure: "청주시청 (2029년 3월 예정) 임시청사 민원실 앞 버스정류장",
    arrival: "충정로역",
  },
};
