import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from ".";

const meta: Meta<typeof Badge> = {
  title: "shared/Badge",
  component: Badge,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "마곡나루역", variant: "default" },
};

export const Selected: Story = {
  args: { children: "수원역", variant: "selected" },
};

export const Primary: Story = {
  args: { children: "1순위", variant: "primary" },
};

export const NameBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="outline">김철수</Badge>
      <Badge variant="outline">박민지</Badge>
      <Badge variant="outline">최영수</Badge>
    </div>
  ),
};

export const StationBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="selected">수원역</Badge>
      <Badge variant="default">마곡나루역</Badge>
      <Badge variant="default">서울대공원역</Badge>
    </div>
  ),
};

export const CategoryChips: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="outline" size="md">
        🖥 스터디카페
      </Badge>
      <Badge variant="outline" size="md">
        📊 회의실
      </Badge>
      <Badge variant="outline" size="md">
        🍴 식당
      </Badge>
      <Badge variant="outline" size="md">
        ☕ 카페
      </Badge>
    </div>
  ),
};
