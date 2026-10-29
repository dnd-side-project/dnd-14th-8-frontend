import type { Meta, StoryObj } from "@storybook/react";
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";
import { FixedBottomArea } from "@/shared/components/fixed-bottom-area";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";

const meta = {
  title: "shared/FloatingScrollTop",
  component: FloatingScrollTop,
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <div className="flex w-full justify-end">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof FloatingScrollTop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { top: 20 },
  render: (args) => (
    <div className="relative h-[1400px] w-full">
      <FixedBottomArea floating={<FloatingScrollTop {...args} />}>
        <BottomActionBarWithButtonAndShare
          onClick={() => undefined}
          onShare={() => undefined}
        >
          일정 수정하기
        </BottomActionBarWithButtonAndShare>
      </FixedBottomArea>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex w-full justify-end gap-2">
      <FloatingScrollTop id="floating-default" top={0} />
      <FloatingScrollTop id="floating-hover" top={0} />
      <FloatingScrollTop id="floating-pressed" top={0} />
    </div>
  ),
  parameters: {
    pseudo: {
      hover: "#floating-hover",
      active: "#floating-pressed",
    },
  },
};
