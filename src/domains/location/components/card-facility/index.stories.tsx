import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CardFacility } from ".";

const meta = {
  title: "domains/location/CardFacility",
  component: CardFacility,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof CardFacility>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "모여 스터디룸",
    stationName: "을지로3가",
    distanceMeters: 120,
  },
};

export const LongName: Story = {
  args: {
    name: "을지로 공유회의실 2층 대회의실 정기 모임 전용 공간",
    stationName: "동대문역사문화공원",
    distanceMeters: 980,
  },
};

/** 검색 기준 역이 추천에서 빠졌거나 추천이 없을 때. 어디서 잰 거리인지 몰라 거리 줄을 숨긴다. */
export const WithoutStation: Story = {
  args: {
    name: "모여 스터디룸",
    distanceMeters: 120,
  },
};

export const Showcase: Story = {
  args: {
    name: "모여 스터디룸",
    stationName: "을지로3가",
    distanceMeters: 120,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <CardFacility
        name="모여 스터디룸"
        stationName="을지로3가"
        distanceMeters={120}
      />
      <CardFacility name="카페 마루" stationName="서울역" distanceMeters={40} />
    </div>
  ),
};
