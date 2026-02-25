import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ItemSavedplace } from ".";

const meta = {
  title: "domains/location/ItemSavedplace",
  component: ItemSavedplace,
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: { onEdit: fn(), onDelete: fn() },
} satisfies Meta<typeof ItemSavedplace>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "집",
    location: "우리집",
    address: "서울시 강남구 역삼동 123-45",
  },
};

export const WorkPlace: Story = {
  args: {
    name: "직장",
    location: "사무실",
    address: "서울시 마포구 상암동 디지털미디어시티",
  },
};

export const Showcase: Story = {
  args: {
    name: "집",
    location: "우리집",
    address: "서울시 강남구 역삼동 123-45",
  },
  render: () => (
    <div className="flex flex-col">
      <ItemSavedplace
        name="집"
        location="우리집"
        address="서울시 강남구 역삼동 123-45"
        onEdit={fn()}
        onDelete={fn()}
      />
      <ItemSavedplace
        name="직장"
        location="회사"
        address="서울시 마포구 상암동 디지털미디어시티"
        onEdit={fn()}
        onDelete={fn()}
      />
      <ItemSavedplace
        name="자주 가는 곳"
        location="스터디카페"
        address="서울시 서초구 서초동 1234"
        onEdit={fn()}
        onDelete={fn()}
      />
    </div>
  ),
};
