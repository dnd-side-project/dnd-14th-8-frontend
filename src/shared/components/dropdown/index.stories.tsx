import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, DropdownOption } from "@/shared/components/dropdown";

const TIME_OPTIONS = ["23:00", "23:30", "24:00"] as const;

function renderTimeOptions() {
  return (
    <>
      <DropdownOption key="placeholder" disabled value="">
        시간을 선택해주세요
      </DropdownOption>
      {TIME_OPTIONS.map((time) => (
        <DropdownOption key={time} value={time}>
          {time}
        </DropdownOption>
      ))}
    </>
  );
}

const meta = {
  title: "shared/Dropdown",
  component: Dropdown,
  args: {
    className: "w-[155px]",
    defaultValue: "",
    required: true,
    children: renderTimeOptions(),
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultAndPressed: Story = {
  render: () => {
    const options = renderTimeOptions();
    return (
      <div className="flex w-full flex-col gap-2">
        <Dropdown className="w-[155px]" defaultValue="">
          {options}
        </Dropdown>
        <Dropdown className="w-[155px]" defaultValue="" id="dropdown-pressed">
          {options}
        </Dropdown>
      </div>
    );
  },
  parameters: {
    pseudo: { active: "#dropdown-pressed" },
  },
};
