import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { StationRecommendationDto } from "@/domains/location/types/location-api-types";
import { StationBadges } from ".";

const MOCK_RECS: StationRecommendationDto[] = [
  {
    stationId: 1,
    stationName: "김포공항역",
    latitude: 37.562,
    longitude: 126.801,
    line: "5호선",
    rank: 1,
    avgTransitDuration: 92,
    distanceFromCenter: 1200,
    routes: [],
  },
  {
    stationId: 2,
    stationName: "합정역",
    latitude: 37.55,
    longitude: 126.913,
    line: "2호선",
    rank: 2,
    avgTransitDuration: 65,
    distanceFromCenter: 800,
    routes: [],
  },
  {
    stationId: 3,
    stationName: "홍대입구역",
    latitude: 37.557,
    longitude: 126.924,
    line: "2호선",
    rank: 3,
    avgTransitDuration: 58,
    distanceFromCenter: 600,
    routes: [],
  },
];

const meta = {
  title: "domains/location/StationBadges",
  component: StationBadges,
  decorators: [
    (Story) => (
      <div className="relative mx-auto h-[200px] w-[375px] bg-k-50">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: {
    onBack: fn(),
    onStationClick: fn(),
  },
} satisfies Meta<typeof StationBadges>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recommendations: MOCK_RECS,
    selectedStationId: 1,
  },
};

export const SecondSelected: Story = {
  args: {
    recommendations: MOCK_RECS,
    selectedStationId: 2,
  },
};

export const NoneSelected: Story = {
  args: {
    recommendations: MOCK_RECS,
    selectedStationId: undefined,
  },
};
