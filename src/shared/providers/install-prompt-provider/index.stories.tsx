import type { Meta, StoryObj } from "@storybook/react";
import { InstallPromptView } from "@/shared/providers/install-prompt-provider/install-prompt-view";

const meta = {
  title: "shared/InstallPromptView",
  component: InstallPromptView,
  args: {
    isMounted: true,
    isOpen: true,
    mode: "prompt",
    shareStep: "more",
    onClose: () => {},
    onInstall: () => {},
  },
  decorators: [
    (Story) => (
      <div className="relative h-[560px] w-[375px] bg-fill-neutral-subtlest">
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

/** iOS 사파리는 프로그래밍 방식 설치가 없어 수동 안내만 보여준다. iOS 26 Safari의 1단계다. */
export const IosGuide: Story = {
  args: { mode: "guide" },
};

/** iOS 18 이하 Safari는 아래 막대의 공유 버튼을 안내한다. */
export const IosGuideToolbar: Story = {
  args: { mode: "guide", shareStep: "toolbar" },
};

/** iOS 27 이상 Safari는 주소창 왼쪽 버튼을 안내한다. */
export const IosGuidePageMenu: Story = {
  args: { mode: "guide", shareStep: "pageMenu" },
};

/** Safari가 아닌 iOS 브라우저(Chrome 등)는 메뉴 위치를 알 수 없어 공유 버튼만 안내한다. */
export const IosGuideOtherBrowser: Story = {
  args: { mode: "guide", shareStep: "other" },
};
