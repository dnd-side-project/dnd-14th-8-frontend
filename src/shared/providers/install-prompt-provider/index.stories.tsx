import type { Meta, StoryObj } from "@storybook/react";
import { InstallPromptView } from "@/shared/providers/install-prompt-provider/install-prompt-view";

const meta = {
  title: "shared/InstallPromptView",
  component: InstallPromptView,
  args: {
    isMounted: true,
    isOpen: true,
    mode: "prompt",
    onClose: () => {},
    onInstall: () => {},
  },
  decorators: [
    (Story) => (
      <div className="relative h-[560px] w-[375px] bg-k-10">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof InstallPromptView>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 안드로이드 크롬처럼 beforeinstallprompt를 받은 경우. */
export const NativePrompt: Story = {};

/** iOS 사파리는 프로그래밍 방식 설치가 없어 수동 안내만 보여준다. */
export const IosGuide: Story = {
  args: { mode: "guide" },
};
