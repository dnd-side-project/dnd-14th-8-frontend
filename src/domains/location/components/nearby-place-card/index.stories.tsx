import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { NearbyPlaceCard } from ".";

const meta = {
  title: "domains/location/NearbyPlaceCard",
  component: NearbyPlaceCard,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof NearbyPlaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "모여 스터디룸",
    address: "서울 중구 을지로 100",
    stationName: "을지로3가역",
    distanceMeters: 120,
  },
};

// 결과 화면 주변 살펴보기 탭의 카드 목록과 같은 간격이다.
export const List: Story = {
  args: {
    name: "모여 스터디룸",
    address: "서울 중구 을지로 100",
    stationName: "을지로3가역",
    distanceMeters: 120,
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <NearbyPlaceCard
        name="모여 스터디룸"
        address="서울 중구 을지로 100"
        stationName="을지로3가역"
        distanceMeters={120}
      />
      <NearbyPlaceCard
        name="을지 스터디카페"
        address="서울 중구 을지로 101"
        stationName="을지로3가역"
        distanceMeters={260}
      />
      <NearbyPlaceCard
        name="한빛 스터디룸"
        address="서울 중구 을지로 102"
        stationName="을지로3가역"
        distanceMeters={410}
      />
    </div>
  ),
};

// 이름과 주소가 길면 한 줄에서 말줄임한다.
export const LongText: Story = {
  args: {
    name: "동대문역사문화공원 공유 스터디룸 앤 세미나실 2호점",
    address: "서울 중구 장충단로 지하 230 동대문역사문화공원역 지하상가 B동",
    stationName: "동대문역사문화공원역",
    distanceMeters: 980,
  },
};
