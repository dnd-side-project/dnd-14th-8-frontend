import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "@/shared/components/modal";

const meta: Meta<typeof Modal> = {
  title: "shared/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />;
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Interactive: Story = {
  args: {
    isOpen: true,
    title: "외부 클릭 테스트",
    caption: "모달 바깥 영역을 클릭하면 닫힙니다.",
    primaryButton: {
      label: "확인",
      color: "blue",
      onClick: () => alert("확인 클릭"),
    },
  },
};

export const SingleButton: Story = {
  args: {
    isOpen: true,
    title: "text",
    caption: "caption text",
    primaryButton: {
      label: "text",
      color: "blue",
      onClick: () => alert("Primary Button Clicked"),
    },
  },
};

export const DoubleButton: Story = {
  args: {
    isOpen: true,
    title: "title text",
    caption: "caption text",
    secondaryButton: {
      label: "text",
      color: "gray",
      onClick: () => alert("Secondary Button Clicked"),
    },
    primaryButton: {
      label: "text",
      color: "blue",
      onClick: () => alert("Primary Button Clicked"),
    },
  },
};
