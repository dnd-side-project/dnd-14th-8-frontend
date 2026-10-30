import { Toast, ToastProvider, ToastViewport } from "@moyeorak/design-system";
import { useSyncExternalStore } from "react";
import { createToastStore } from "@/shared/components/toast/toast-store";

const store = createToastStore();

export const toast = {
  success: store.success,
  error: store.error,
  message: store.message,
  dismiss: store.dismiss,
};

// sonner 기본값과 같게 4초 뒤 닫는다.
const DURATION_MS = 4000;

// 디자인 시스템 가이드: 하단 영역 12px 위에 띄운다. FixedBottomArea가 없는 화면은
// 하단 ActionArea(single, 80px)가 페이지 끝에 놓이므로 그 높이를 기본값으로 둔다.
const VIEWPORT_BOTTOM = "calc(var(--fixed-bottom-area-height, 80px) + 12px)";

export function Toaster() {
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  return (
    <ToastProvider duration={DURATION_MS} label="알림">
      {items.map((item) => (
        <Toast
          key={item.key}
          variant={item.variant}
          message={item.message}
          onOpenChange={(open) => {
            if (!open) store.dismiss(item.id);
          }}
        />
      ))}
      <ToastViewport
        label="알림 ({hotkey})"
        style={{ bottom: VIEWPORT_BOTTOM }}
      />
    </ToastProvider>
  );
}
