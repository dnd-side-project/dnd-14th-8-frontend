import type { Meta, StoryObj } from "@storybook/react";
import { addMonths, endOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/shared/components/calendar";

const toDates = (days: number[]) => days.map((day) => new Date(2026, 11, day));

const meta = {
  title: "shared/Calendar",
  component: Calendar,
  args: {
    defaultMonth: new Date(2026, 11, 1),
    locale: ko,
    showOutsideDays: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultSelected: toDates([16]) } };

export const DateSelected: Story = {
  args: {
    defaultSelected: toDates([
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    ]),
  },
};

export const MixedSelected: Story = {
  args: { defaultSelected: toDates([16, 18, 21, 23, 27, 30]) },
};

export const FromCurrentMonth: Story = {
  render: (args) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return <Calendar {...args} defaultMonth={currentMonth} startDate={today} />;
  },
};

export const BoundedMonthRange: Story = {
  render: (args) => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return (
      <Calendar
        {...args}
        defaultMonth={currentMonth}
        endDate={endOfMonth(addMonths(currentMonth, 2))}
        startDate={currentMonth}
      />
    );
  },
};
