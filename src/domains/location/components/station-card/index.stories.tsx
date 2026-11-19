import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StationCard } from ".";

const meta = {
  title: "domains/location/StationCard",
  component: StationCard,
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof StationCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rank: 1, name: "을지로3가역", durationMinutes: 27 },
};

export const Selected: Story = {
  args: { rank: 1, name: "을지로3가역", durationMinutes: 27, selected: true },
};

export const OverAnHour: Story = {
  args: { rank: 3, name: "서울역", durationMinutes: 70 },
};

// 역 이름이 134px보다 길면 카드가 192px보다 넓어진다.
export const LongName: Story = {
  args: { rank: 4, name: "동대문역사문화공원역", durationMinutes: 30 },
};

// 가로로 넘기는 줄. 결과 화면의 카드 줄과 같은 클래스다.
export const Row: Story = {
  args: { rank: 1, name: "을지로3가역", durationMinutes: 27 },
  render: () => (
    <div className="w-[375px] px-5 py-3">
      <div className="scrollbar-hide -mx-5 -my-1 flex gap-3 overflow-x-auto px-5 py-1">
        <StationCard
          rank={1}
          name="을지로3가역"
          durationMinutes={27}
          selected
        />
        <StationCard rank={2} name="충무로역" durationMinutes={28} />
        <StationCard
          rank={3}
          name="동대문역사문화공원역"
          durationMinutes={70}
        />
      </div>
    </div>
  ),
};
