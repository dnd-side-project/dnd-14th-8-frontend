import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "@/shared/components/select";

const options = [
  { label: "김지원", value: "김지원" },
  { label: "황민현", value: "황민현" },
  { label: "임윤아", value: "임윤아" },
  { label: "장현승", value: "장현승" },
  { label: "김소라", value: "김소라" },
  { label: "박민지", value: "박민지" },
];

const meta = {
  title: "shared/Select",
  component: Select,
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
  args: {
    label: "이름",
    placeholder: "이름을 선택해주세요",
    options,
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState("");

    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const States: Story = {
  render: (args) => {
    const [value, setValue] = useState("progress");

    return (
      <div className="flex flex-col gap-8">
        <Select {...args} value={value} onChange={setValue} />
        <Select
          {...args}
          value="done"
          status="error"
          helperText="필수 값이에요"
        />
        <Select {...args} value="all" disabled helperText="비활성화 상태" />
      </div>
    );
  },
};
