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

export const Open: Story = {
  args: {
    name: "스터디카페 24",
    distanceFromBase: 150,
    isOpen: true,
    businessStatusMessage: "22:00 까지",
  },
};

export const Closed: Story = {
  args: {
    name: "스터디카페 24",
    distanceFromBase: 150,
    isOpen: false,
    businessStatusMessage: "09:00 에 시작",
  },
};

export const Showcase: Story = {
  args: {
    name: "스터디카페 24",
    distanceFromBase: 150,
    isOpen: true,
    businessStatusMessage: "22:00 까지",
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <CardFacility
        name="스터디카페 24"
        distanceFromBase={150}
        isOpen={true}
        businessStatusMessage="22:00 까지"
      />
      <CardFacility
        name="스타벅스 강남점"
        distanceFromBase={320}
        isOpen={false}
        businessStatusMessage="08:00 에 시작"
      />
    </div>
  ),
};
