import type { Meta, StoryObj } from "@storybook/react";
import { BottomSheet } from ".";

const meta = {
  title: "domains/location/BottomSheet",
  component: BottomSheet,
  decorators: [
    (Story, context) => (
      <div
        className="relative mx-auto w-[375px] overflow-hidden bg-k-50"
        style={{ height: context.parameters.containerHeight ?? 812 }}
      >
        <div className="flex h-full items-center justify-center text-b4 text-k-400">
          지도 영역
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Peek: Story = {
  args: {
    defaultSnap: "peek",
    children: (
      <div className="px-5 py-4">
        <h2 className="text-k-900 text-t1">Peek 상태</h2>
        <p className="mt-2 text-b4 text-k-500">content 219px + handle</p>
      </div>
    ),
  },
};

export const Half: Story = {
  args: {
    defaultSnap: "half",
    children: (
      <div className="px-5 py-4">
        <h2 className="text-k-900 text-t1">Half 상태</h2>
        <p className="mt-2 text-b4 text-k-500">content 494px + handle</p>
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`item-${i + 1}`}
              className="h-16 rounded-lg bg-k-50 px-4 py-3"
            >
              <p className="text-b4 text-k-700">리스트 항목 {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const Full: Story = {
  args: {
    defaultSnap: "full",
    children: (
      <div className="px-5 py-4">
        <h2 className="text-k-900 text-t1">Full 상태</h2>
        <p className="mt-2 text-b4 text-k-500">content 711px + handle</p>
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={`item-${i + 1}`}
              className="h-16 rounded-lg bg-k-50 px-4 py-3"
            >
              <p className="text-b4 text-k-700">리스트 항목 {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

/**
 * iPhone SE(667px)에서의 full 스냅. 시안 높이 747px을 그대로 쓰면 뷰포트를
 * 80px 넘겨 드래그 핸들이 화면 밖으로 밀려났다.
 */
export const SmallScreenFull: Story = {
  args: {
    defaultSnap: "full",
    children: (
      <div className="px-5 py-4">
        <h2 className="text-k-900 text-t1">작은 화면 Full 상태</h2>
        <p className="mt-2 text-b4 text-k-500">
          뷰포트 667px — 핸들이 화면 안에 남아야 한다
        </p>
      </div>
    ),
  },
  parameters: { containerHeight: 667 },
};
