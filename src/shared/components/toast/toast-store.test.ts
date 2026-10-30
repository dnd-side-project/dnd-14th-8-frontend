import { describe, expect, it, vi } from "vitest";
import { createToastStore } from "@/shared/components/toast/toast-store";

describe("createToastStore", () => {
  it("maps success, error and message to the design system variants", () => {
    const store = createToastStore();

    store.success("출발지가 추가되었어요");
    store.error("출발지를 추가하지 못했어요. 다시 시도해주세요");
    store.message("일정 추가하기를 눌러 가능한 시간을 입력해주세요");

    expect(store.getSnapshot().map((item) => item.variant)).toEqual([
      "positive",
      "negative",
      "neutral",
    ]);
  });

  it("replaces a toast with the same id instead of stacking it", () => {
    const store = createToastStore();

    store.message("첫 안내", { id: "guide" });
    const firstKey = store.getSnapshot()[0].key;
    store.message("두 번째 안내", { id: "guide" });

    const items = store.getSnapshot();
    expect(items).toHaveLength(1);
    expect(items[0].message).toBe("두 번째 안내");
    // 새 키를 받아 닫히는 시간이 처음부터 다시 흐른다.
    expect(items[0].key).not.toBe(firstKey);
  });

  it("keeps only the latest three toasts on screen", () => {
    const store = createToastStore();

    for (const message of ["1", "2", "3", "4"]) store.success(message);

    expect(store.getSnapshot().map((item) => item.message)).toEqual([
      "2",
      "3",
      "4",
    ]);
  });

  it("dismisses one toast by id or all toasts at once", () => {
    const store = createToastStore();

    const first = store.success("1");
    store.success("2");
    store.dismiss(first);
    expect(store.getSnapshot().map((item) => item.message)).toEqual(["2"]);

    store.dismiss();
    expect(store.getSnapshot()).toEqual([]);
  });

  it("notifies subscribers until they unsubscribe", () => {
    const store = createToastStore();
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    store.success("1");
    unsubscribe();
    store.success("2");

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
