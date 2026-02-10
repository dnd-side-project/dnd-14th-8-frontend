import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from ".";

const meta: Meta<typeof TextField> = {
  title: "shared/TextField",
  component: TextField,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TextField>;

/** 기본 placeholder 상태 (디자인 #2) */
export const Default: Story = {
  args: {
    label: "방장 이름",
    placeholder: "방장의 이름을 작성해주세요",
    helperText: "최대 5자까지 입력할 수 있어요.",
    maxLength: 5,
  },
};

/** 값이 입력된 상태 (디자인 #5) */
export const Filled: Story = {
  args: {
    label: "방장 이름",
    helperText: "최대 4자까지 입력할 수 있어요.",
    maxLength: 5,
    defaultValue: "김철수",
  },
};

/** 에러 상태 — 빨간 테두리 + 에러 메시지 (디자인 #6) */
export const ErrorState: Story = {
  args: {
    label: "방장 이름",
    errorMessage: "이름을 입력해주세요.",
    maxLength: 4,
  },
};

/** 라벨 없는 입력 필드 */
export const NoLabel: Story = {
  args: {
    placeholder: "이름을 작성해주세요",
    helperText: "최대 5자까지 입력할 수 있어요.",
    maxLength: 5,
  },
};

/** 상태 모아보기 */
export const AllStates: Story = {
  render: () => {
    const [val, setVal] = useState("김철수");
    return (
      <div className="flex flex-col gap-6">
        <TextField
          label="기본 (placeholder)"
          placeholder="방장의 이름을 작성해주세요"
          helperText="최대 5자까지 입력할 수 있어요."
          maxLength={5}
        />
        <TextField
          label="입력 상태 (controlled)"
          helperText="최대 5자까지 입력할 수 있어요."
          maxLength={5}
          value={val}
          onValueChange={setVal}
        />
        <TextField
          label="에러 상태"
          errorMessage="이름을 입력해주세요."
          maxLength={4}
        />
      </div>
    );
  },
};
