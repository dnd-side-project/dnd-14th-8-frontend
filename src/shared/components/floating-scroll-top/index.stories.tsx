import type { Meta, StoryObj } from "@storybook/react";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";
import { useScrollToTop } from "@/shared/hooks/use-scroll-to-top";

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

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex w-full justify-end gap-2">
      <FloatingScrollTop id="floating-default" />
      <FloatingScrollTop id="floating-hover" />
      <FloatingScrollTop id="floating-pressed" />
    </div>
  ),
  parameters: {
    pseudo: {
      hover: "#floating-hover",
      active: "#floating-pressed",
    },
  },
};

export const WithScrollToTopHook: Story = {
  render: () => {
    const handleScrollTop = useScrollToTop();
    return <FloatingScrollTop onClick={handleScrollTop} />;
  },
};
