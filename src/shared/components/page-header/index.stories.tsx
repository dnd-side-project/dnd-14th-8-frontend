import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from ".";

const meta: Meta<typeof PageHeader> = {
  title: "shared/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    argTypes: {
      onBack: { action: "back-clicked" },
      onRightPress: { action: "right-press-clicked" },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-100 bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "모임정보 입력",
    onBack: () => alert("뒤로가기 클릭!"),
  },
};

export const WithTextAction: Story = {
  args: {
    title: "일정 추가하기",
    onBack: () => alert("뒤로가기 클릭!"),
    rightElement: <span className="text-b3 text-primary-main">초기화</span>,
    rightLabel: "초기화",
    onRightPress: () => alert("초기화 클릭!"),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="space-y-2">
        <p className="text-b2 text-k-400"># Case 1: Standard</p>
        <PageHeader title="text" onBack={() => {}} />
      </section>
      <section className="space-y-2">
        <p className="text-b2 text-k-400"># Case 2: With Action</p>
        <PageHeader
          title="text"
          onBack={() => {}}
          rightElement={
            <span className="text-b3 text-primary-main">초기화</span>
          }
        />
      </section>
    </div>
  ),

  decorators: [
    (Story) => (
      <div className="w-100 bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};
