import type { Meta, StoryObj } from "@storybook/react";
import { SUBWAY_LINE_COLORS } from "@/domains/location/constants/subway-line-colors";
import { SubwayLineBadge } from ".";

const meta = {
  title: "domains/location/SubwayLineBadge",
  component: SubwayLineBadge,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SubwayLineBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { line: "2호선" },
};

// 색 표에 없는 노선
export const UnknownLine: Story = {
  args: { line: "위례선" },
};

// 색 표의 노선 24가지
export const AllLines: Story = {
  args: { line: "1호선" },
  render: () => (
    <div className="flex w-[320px] flex-wrap gap-1">
      {Object.keys(SUBWAY_LINE_COLORS).map((line) => (
        <SubwayLineBadge key={line} line={line} />
      ))}
    </div>
  ),
};
