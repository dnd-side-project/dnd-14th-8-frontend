import type { Meta, StoryObj } from "@storybook/react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "shared/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "blue", "secondary", "ghost", "icon"],
    },
    size: { control: "select", options: ["lg", "md", "sm", "icon"] },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "모임 생성하기", variant: "primary" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const PrimaryDisabled: Story = {
  args: { children: "작성완료", variant: "primary", disabled: true },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Blue: Story = {
  args: { children: "장소 정하러가기", variant: "blue" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Secondary: Story = {
  args: { children: "✕ 초기화", variant: "secondary", size: "sm" },
};

export const Ghost: Story = {
  args: { children: "주변 둘러보기 >", variant: "ghost", size: "sm" },
};

export const Icon: Story = {
  args: {
    children: <ChevronLeftIcon className="size-5" />,
    variant: "icon",
    size: "icon",
    "aria-label": "뒤로가기",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Button variant="primary">모임 생성하기</Button>
      <Button variant="primary" disabled>
        작성완료
      </Button>
      <Button variant="blue">장소 정하러가기</Button>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">
          ✕ 초기화
        </Button>
        <Button variant="ghost" size="sm">
          주변 둘러보기 &gt;
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="blue" size="md" className="flex-1">
          삭제
        </Button>
        <Button variant="secondary" size="md" className="flex-1">
          취소
        </Button>
      </div>
    </div>
  ),
};
