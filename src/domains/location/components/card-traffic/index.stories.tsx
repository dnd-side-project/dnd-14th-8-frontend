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
