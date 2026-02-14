import type { Meta, StoryObj } from "@storybook/react";
import { ShareButton } from "@/shared/components/share-button";

const meta = {
  title: "shared/ShareButton",
  component: ShareButton,
  args: {
    channel: "kakaotalk",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShareButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Channels: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <ShareButton channel="kakaotalk" />
      <ShareButton channel="link" />
      <ShareButton channel="more" />
    </div>
  ),
};
