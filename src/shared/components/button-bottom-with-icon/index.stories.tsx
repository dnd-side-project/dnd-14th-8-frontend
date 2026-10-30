import { Icon } from "@moyeorak/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonBottomWithIcon } from "@/shared/components/button-bottom-with-icon";

const meta = {
  title: "shared/ButtonBottomWithIcon",
  component: ButtonBottomWithIcon,
  args: { children: "Button", icon: <Icon type="blank" size="xs" /> },
  argTypes: { icon: { control: false } },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonBottomWithIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => {
    const icon = <Icon type="blank" size="xs" />;
    return (
      <div className="flex w-full flex-col gap-2">
        <ButtonBottomWithIcon icon={icon} id="icon-default">
          Default
        </ButtonBottomWithIcon>
        <ButtonBottomWithIcon icon={icon} id="icon-hover">
          Hover
        </ButtonBottomWithIcon>
        <ButtonBottomWithIcon icon={icon} id="icon-pressed">
          Pressed
        </ButtonBottomWithIcon>
      </div>
    );
  },
  parameters: { pseudo: { active: "#icon-pressed", hover: "#icon-hover" } },
};
