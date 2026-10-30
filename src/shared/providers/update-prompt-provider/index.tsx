import { Modal } from "@moyeorak/design-system";
import { type PropsWithChildren, useSyncExternalStore } from "react";

// 서비스 워커 등록은 React 밖(main.tsx)에서 일어나므로, 열림 상태를 모듈에서 관리한다.
let isOpen = false;
const listeners = new Set<() => void>();

function setOpen(next: boolean) {
  isOpen = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => isOpen;

/** 새 버전이 준비됐을 때 새로고침할지 묻는 모달을 연다. */
export function openUpdatePrompt() {
  setOpen(true);
}

interface UpdatePromptProviderProps extends PropsWithChildren {
  /** 새로고침을 골랐을 때 부른다. 대기 중인 워커를 활성화하고 페이지를 다시 불러온다. */
  onRefresh: () => void;
}

export function UpdatePromptProvider({
  children,
  onRefresh,
}: UpdatePromptProviderProps) {
  const open = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <>
      {children}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="업데이트된 버전으로 새로고침할까요?"
        body={"지금 새로고침하면 입력 중인 내용이\n사라질 수 있어요"}
        mainLabel="새로고침"
        onMain={() => {
          setOpen(false);
          onRefresh();
        }}
        alternativeLabel="나중에"
        onAlternative={() => setOpen(false)}
      />
    </>
  );
}
