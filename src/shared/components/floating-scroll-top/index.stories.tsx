import type { Meta, StoryObj } from "@storybook/react";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";
import { IconButton } from "@/shared/components/icon-button";
import { ShareIcon } from "@/shared/components/icons";

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
      <FloatingScrollTop {...args} className="bottom-[90px]" />
      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[375px] items-center gap-2 px-5 py-3">
        <ShareIconButton />
        <ButtonBottom className="w-full flex-1" variant="black">
          일정 수정하기
        </ButtonBottom>
      </div>
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

const ShareIconButton = () => {
  return (
    <IconButton
      icon={ShareIcon}
      size="2xl"
      background="square"
      backgroundSize="lg"
      iconSize="xl"
      variant="dark"
    />
  );
};
