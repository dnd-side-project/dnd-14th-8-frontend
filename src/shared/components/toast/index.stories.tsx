import type { Meta, StoryObj } from "@storybook/react";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { ChipButton } from "@/shared/components/chip-button";
import { IconButton } from "@/shared/components/icon-button";
import { ShareIcon } from "@/shared/components/icons";
import { Toast, toast } from "@/shared/components/toast";

const DEFAULT_TOASTER_ID = "storybook-toast";

const meta = {
  title: "shared/Toast",
  component: Toast,
  args: {
    closeButton: false,
    duration: 2000,
    id: DEFAULT_TOASTER_ID,
    position: "bottom-center",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto h-dvh w-[375px] px-5">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const toasterId = args.id ?? DEFAULT_TOASTER_ID;

    return (
      <div className="relative h-full w-full">
        <Toast {...args} />

        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
          <ChipButton
            size="lg"
            variant="primary"
            onClick={() => toast.success("완료되었어요", { toasterId })}
          >
            완료
          </ChipButton>
          <ChipButton
            size="lg"
            variant="outlined"
            onClick={() => toast.error("다시 시도해 주세요", { toasterId })}
          >
            오류
          </ChipButton>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-5 py-3">
          <ShareIconButton />
          <ButtonBottom className="w-full flex-1" variant="black">
            일정 수정하기
          </ButtonBottom>
        </div>
      </div>
    );
  },
};

const ShareIconButton = () => {
  return (
    <IconButton
      icon={ShareIcon}
      size="2xl"
      background="square"
      backgroundSize="lg"
      iconSize="xl"
      variant="dark"
    />
  );
};
