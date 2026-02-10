import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@/shared/components/button";
import { Toast } from ".";

const meta: Meta<typeof Toast> = {
  title: "shared/Toast",
  component: Toast,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const ScheduleUpdated: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Toast 보기
        </Button>
        <Toast
          open={open}
          message="일정이 수정되었어요!"
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const LinkCopied: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Toast 보기
        </Button>
        <Toast
          open={open}
          message="링크를 복사했어요"
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};
