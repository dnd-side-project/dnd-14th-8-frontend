import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SelectedPlaceCard } from ".";

const meta = {
  title: "domains/location/SelectedPlaceCard",
  component: SelectedPlaceCard,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: {
    name: "모여 스터디룸",
    address: "서울 중구 을지로 100",
    stationName: "을지로3가역",
    distanceMeters: 120,
    onClose: fn(),
  },
} satisfies Meta<typeof SelectedPlaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 이름과 주소가 길면 닫기 버튼 앞에서 한 줄로 말줄임한다.
export const LongText: Story = {
  args: {
    name: "동대문역사문화공원 공유 스터디룸 앤 세미나실 2호점",
    address: "서울 중구 장충단로 지하 230 동대문역사문화공원역 지하상가 B동",
    stationName: "동대문역사문화공원역",
    distanceMeters: 980,
  },
};
