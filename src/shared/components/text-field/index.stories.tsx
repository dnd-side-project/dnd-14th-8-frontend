import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "@/shared/components/text-field";

const meta = {
  title: "shared/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    status: {
      control: "select",
      options: ["default", "focused", "error"],
    },
    onClear: { action: "cleared" },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const isError = args.maxLength ? value.length > args.maxLength : false;
    return (
      <TextField
        {...args}
        status={args.status || (isError ? "error" : "default")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        helperText={isError ? "최대 4자까지 적을 수 있어요" : args.helperText}
      />
    );
  },
  args: {
    label: "방장 이름",
    placeholder: "이름을 입력해주세요",
    helperText: "최대 4자까지 입력할 수 있어요",
    maxLength: 4,
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <TextField
        label="방장 이름"
        placeholder="이름을 입력해주세요"
        helperText="최대 4자까지 적을 수 있어요"
        maxLength={4}
      />

      <TextField label="방장 이름" value="김혜인" maxLength={4} />

      <TextField label="방장 이름" status="focused" value="김" maxLength={4} />

      <TextField
        label="방장 이름"
        status="error"
        value="김혜인인인"
        helperText="최대 4자까지 적을 수 있어요"
        maxLength={4}
      />

      <TextField
        label="방장 이름"
        status="error"
        value=""
        helperText="이름을 입력해주세요"
        maxLength={4}
      />
    </div>
  ),
};
