import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/shared/components/button";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
  BottomSheetTrigger,
} from ".";

const meta: Meta = {
  title: "shared/BottomSheet",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center bg-k-50">
      <BottomSheet>
        <BottomSheetTrigger asChild>
          <Button variant="primary" className="w-48">
            바텀시트 열기
          </Button>
        </BottomSheetTrigger>
        <BottomSheetContent>
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="size-20 rounded-full bg-k-100" />
            <BottomSheetTitle className="text-center">
              출발지를 추가해주세요
            </BottomSheetTitle>
            <BottomSheetDescription className="text-center">
              현재 아무도 출발지를 등록하지 않았어요
              <br />
              공유해주세요
            </BottomSheetDescription>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center bg-k-50">
      <BottomSheet>
        <BottomSheetTrigger asChild>
          <Button variant="blue" className="w-48">
            결과 보기
          </Button>
        </BottomSheetTrigger>
        <BottomSheetContent>
          <div className="flex flex-col gap-4">
            <p className="text-k-900 text-t2">
              10명중 <span className="text-primary-main">8</span>명의 최적
              모임장소예요
            </p>
            <div className="flex gap-2">
              <span className="rounded-full bg-k-600 px-4 py-1 text-c1 text-white">
                수원역
              </span>
              <span className="rounded-full border border-k-200 px-4 py-1 text-c1 text-k-700">
                마곡나루역
              </span>
              <span className="rounded-full border border-k-200 px-4 py-1 text-c1 text-k-700">
                서울대공원역
              </span>
            </div>
            <div className="rounded-xl border border-k-100 p-4">
              <p className="text-b3 text-k-900">수원역</p>
              <p className="mt-1 text-b5 text-k-500">
                🚌 평균 1시간 32분 &nbsp; 🚗 평균 1시간 13분
              </p>
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <div className="relative h-screen bg-k-50">
      <div className="flex h-1/2 items-center justify-center text-k-400">
        지도 영역
      </div>
      <BottomSheet open>
        <BottomSheetContent>
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="size-20 rounded-full bg-k-100" />
            <BottomSheetTitle className="text-center">
              출발지를 추가해주세요
            </BottomSheetTitle>
            <BottomSheetDescription className="text-center">
              현재 아무도 출발지를 등록하지 않았어요
            </BottomSheetDescription>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  ),
};
