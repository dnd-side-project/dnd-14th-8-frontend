export type ToastVariant = "neutral" | "negative" | "positive";

export interface ToastItem {
  /** 렌더링 키. 같은 id로 다시 띄우면 새 키를 받아 자동으로 닫히는 시간이 처음부터 다시 흐른다. */
  key: number;
  id: string;
  variant: ToastVariant;
  message: string;
}

export interface ToastOptions {
  /** 같은 id의 토스트는 하나만 보인다. 연달아 띄워도 쌓이지 않고 바뀐다. */
  id?: string;
}

// 하단을 너무 많이 가리지 않도록 동시에 보이는 개수를 제한한다.
const MAX_VISIBLE = 3;

/**
 * 어디서든 `toast.success("…")`처럼 부를 수 있게, 띄울 토스트 목록을 React 밖에서 관리한다.
 * 화면에는 디자인 시스템 Toast로 그린다.
 */
export function createToastStore() {
  let items: ToastItem[] = [];
  let nextKey = 0;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const show = (
    variant: ToastVariant,
    message: string,
    options: ToastOptions = {},
  ) => {
    nextKey += 1;
    const id = options.id ?? `toast-${nextKey}`;
    items = [
      ...items.filter((item) => item.id !== id),
      { key: nextKey, id, variant, message },
    ].slice(-MAX_VISIBLE);
    emit();
    return id;
  };

  return {
    success: (message: string, options?: ToastOptions) =>
      show("positive", message, options),
    error: (message: string, options?: ToastOptions) =>
      show("negative", message, options),
    message: (message: string, options?: ToastOptions) =>
      show("neutral", message, options),
    /** id를 넘기면 그 토스트만, 생략하면 모두 닫는다. */
    dismiss: (id?: string) => {
      items = id === undefined ? [] : items.filter((item) => item.id !== id);
      emit();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => items,
  };
}
