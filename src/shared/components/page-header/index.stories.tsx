import type { Meta, StoryObj } from "@storybook/react";
import { ChipButton } from "@/shared/components/chip-button";
import { PageHeader } from "@/shared/components/page-header";

const meta: Meta<typeof PageHeader> = {
  title: "shared/PageHeader",
  component: PageHeader,
  argTypes: {
    onBack: { action: "back-clicked" },
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "모임정보 입력",
    onBack: () => {},
  },
};

export const WithChipAction: Story = {
  args: {
    title: "일정 추가하기",
    onBack: () => alert("뒤로가기 클릭!"),
    rightElement: (
      <ChipButton
        variant="ghost"
        size="lg"
        onClick={() => alert("초기화 클릭!")}
      >
        초기화
      </ChipButton>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="space-y-2">
        <p className="px-5 text-b2 text-k-400">
          # Case 1: Standard (Back + Title)
        </p>
        <PageHeader title="텍스트" onBack={() => {}} />
      </section>

      <section className="space-y-2">
        <p className="px-5 text-b2 text-k-400">
          # Case 2: With ChipButton Action
        </p>
        <PageHeader
          title="텍스트"
          onBack={() => {}}
          rightElement={
            <ChipButton variant="ghost" size="lg" onClick={() => {}}>
              초기화
            </ChipButton>
          }
        />
      </section>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-[375px] py-3">
        <Story />
      </div>
    ),
  ],
};
