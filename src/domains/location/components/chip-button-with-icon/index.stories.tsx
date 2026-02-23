import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ChipButtonWithIcon } from "@/domains/location/components/chip-button-with-icon";
import { BookIcon } from "@/shared/components/icons";

const meta: Meta<typeof ChipButtonWithIcon> = {
  title: "domains/location/ChipButtonWithIcon",
  component: ChipButtonWithIcon,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "스터디룸",
    icon: <BookIcon width={20} height={20} />,
    onClick: fn(),
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["selected", "unselected"],
    },
    shadow: {
      control: "inline-radio",
      options: ["on", "off"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChipButtonWithIcon>;

export const Playground: Story = {
  args: {
    status: "unselected",
    shadow: "off",
  },
};

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <ChipButtonWithIcon
          icon={<BookIcon width={20} height={20} />}
          status="selected"
          shadow="off"
        >
          스터디룸
        </ChipButtonWithIcon>

        <ChipButtonWithIcon
          icon={<BookIcon width={20} height={20} />}
          status="selected"
          shadow="on"
        >
          스터디룸
        </ChipButtonWithIcon>
      </div>

      <div className="flex gap-4">
        <ChipButtonWithIcon
          icon={<BookIcon width={20} height={20} />}
          status="unselected"
          shadow="off"
        >
          스터디룸
        </ChipButtonWithIcon>

        <ChipButtonWithIcon
          icon={<BookIcon width={20} height={20} />}
          status="unselected"
          shadow="on"
        >
          스터디룸
        </ChipButtonWithIcon>
      </div>
    </div>
  ),
};
