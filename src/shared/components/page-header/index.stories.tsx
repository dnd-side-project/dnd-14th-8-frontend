import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from ".";

const meta: Meta<typeof PageHeader> = {
  title: "shared/PageHeader",
  component: PageHeader,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-96 border-k-100 border-b">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = {
  args: { title: "모임 생성" },
};

export const WithBack: Story = {
  args: { title: "시간표 편집", onBack: () => {} },
};

export const WithBackAndAction: Story = {
  args: {
    title: "일정 추가하기",
    onBack: () => {},
    rightAction: (
      <button
        type="button"
        className="flex size-10 items-center justify-center text-c1 text-k-400"
        aria-label="도움말"
      >
        ?
      </button>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-k-100">
      <PageHeader title="모임 생성" />
      <PageHeader title="시간표 편집" onBack={() => {}} />
      <PageHeader title="출발지 추가" onBack={() => {}} />
      <PageHeader title="모임정보 수정" onBack={() => {}} />
    </div>
  ),
  decorators: [],
};
