import type { Meta, StoryObj } from "@storybook/react";
import { GuideTimeSelection } from "@/domains/schedule/components/guide-time-selection";

const meta = {
  title: "domains/schedule/GuideTimeSelection",
  component: GuideTimeSelection,
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof GuideTimeSelection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
