import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@/shared/components/button";
import { Modal } from ".";

const meta: Meta<typeof Modal> = {
  title: "shared/Modal",
  component: Modal,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Modal>;

/** 확인 모달 — 중앙 타이틀 + 설명 + 양쪽 보조 버튼 (디자인 #9) */
export const Confirm: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          모달 열기
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="초기화 하겠어요?"
          description="ㄹ ㅇ다 없어져져요"
          actions={
            <>
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                초기화
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
            </>
          }
        />
      </>
    );
  },
};

/** 삭제 모달 — 파란 삭제 + 보조 취소 (디자인 #39) */
export const Delete: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          삭제 모달 열기
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="디지털미디어시티역"
          description="삭제할까요?"
          actions={
            <>
              <Button
                variant="blue"
                size="md"
                className="flex-1 rounded-lg"
                onClick={() => setOpen(false)}
              >
                삭제
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
            </>
          }
        />
      </>
    );
  },
};

/** 공유하기 모달 — 좌측 타이틀 + X 닫기 + 커스텀 콘텐츠 (디자인 #15) */
export const Share: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          공유하기 모달 열기
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="공유하기"
          showClose
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full break-all rounded-lg bg-k-50 px-4 py-3 text-b5 text-k-500">
              http://sjfkalsskajlfjdsakfjslsfsa3293
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="size-12 rounded-full bg-k-100" />
                <span className="text-c2 text-k-600">링크복사</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-12 rounded-full bg-k-100" />
                <span className="text-c2 text-k-600">카카오톡</span>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
