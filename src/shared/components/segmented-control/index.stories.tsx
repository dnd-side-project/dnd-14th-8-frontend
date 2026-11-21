import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedControl } from "@/shared/components/segmented-control";

const FOOD_OPTIONS = [
  { value: "nearest", label: "가까운 순" },
  { value: "popular", label: "맛집" },
  { value: "group", label: "단체" },
] as const;

type FoodValue = (typeof FOOD_OPTIONS)[number]["value"];

const meta: Meta<typeof SegmentedControl> = {
  title: "shared/SegmentedControl",
  component: SegmentedControl,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SegmentedControl>;
export default meta;

type Story = StoryObj<typeof SegmentedControl>;

// 주변 살펴보기 식당 조건(#273). 칸을 누르면 그 칸이 흰 바탕으로 바뀐다.
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<FoodValue>("nearest");

    return (
      <SegmentedControl
        options={FOOD_OPTIONS}
        value={value}
        onChange={setValue}
      />
    );
  },
};
