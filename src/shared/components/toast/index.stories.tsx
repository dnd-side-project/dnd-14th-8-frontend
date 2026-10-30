import { ActionArea, Button } from "@moyeorak/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { FixedBottomArea } from "@/shared/components/fixed-bottom-area";
import { Toaster, toast } from "@/shared/components/toast";

const meta = {
  title: "shared/Toast",
  component: Toaster,
  decorators: [
    (Story) => (
      <div className="mx-auto h-dvh w-[375px] px-5">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="relative h-full w-full">
      <Toaster />

      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
        <Button
          size="sm"
          variant="brand"
          onClick={() => toast.success("클립보드에 복사되었어요")}
        >
          완료
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.error("서비스 지역이 아니에요. 다른 곳을 선택해주세요")
          }
        >
          오류
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.message("일정 추가하기를 눌러 가능한 시간을 입력해주세요", {
              id: "guide",
            })
          }
        >
          안내
        </Button>
      </div>

      <FixedBottomArea>
        <ActionArea
          type="single"
          main={
            <Button size="xl" display="full">
              일정 수정하기
            </Button>
          }
        />
      </FixedBottomArea>
    </div>
  ),
};
