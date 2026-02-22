import type { Meta, StoryObj } from "@storybook/react";
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
};

export default meta;
type Story = StoryObj<typeof Modal>;

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
