import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import type { NearbyCategory } from "@/domains/location/constants/nearby-categories";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
import { NearbyPlacesPanel } from ".";

const place = (
  id: string,
  name: string,
  distanceMeters: number,
): NearbyPlace => ({
  id,
  name,
  address: `서울 중구 을지로 ${100 + (Number(id) % 100)}`,
  distanceMeters,
  latitude: 37.5663,
  longitude: 126.9918,
  placeUrl: `https://place.map.kakao.com/${id}`,
});

const PLACES: Record<NearbyCategory, NearbyPlace[]> = {
  스터디룸: [
    place("9000", "모여 스터디룸", 120),
    place("9001", "을지 스터디카페", 260),
    place("9002", "한빛 스터디룸", 410),
  ],
  회의실: [
    place("9100", "을지로 공유회의실", 180),
    place("9101", "충무 미팅룸", 350),
  ],
  식당: [
    place("9200", "을지 칼국수", 45),
    place("9201", "충무 국밥", 80),
    place("9202", "을지로 감자탕", 110),
  ],
  카페: [
    place("9300", "카페 마루", 40),
    place("9301", "카페 소담", 75),
    place("9302", "카페 들녘", 120),
  ],
};

const meta = {
  title: "domains/location/NearbyPlacesPanel",
  component: NearbyPlacesPanel,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: {
    category: "스터디룸",
    places: PLACES.스터디룸,
    stationName: "을지로3가역",
    onCategoryChange: fn(),
    onPlaceClick: fn(),
  },
} satisfies Meta<typeof NearbyPlacesPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

// 칩을 누르면 그 분류의 장소로 바뀐다.
export const Default: Story = {
  render: (args) => {
    const [category, setCategory] = useState<NearbyCategory>(args.category);

    return (
      <NearbyPlacesPanel
        {...args}
        category={category}
        places={PLACES[category]}
        onCategoryChange={(next) => {
          setCategory(next);
          args.onCategoryChange(next);
        }}
      />
    );
  },
};

// 찾는 중이거나 장소가 없을 때. 칩만 남고 카드 자리는 비어 있다.
export const Empty: Story = {
  args: { places: [] },
};
