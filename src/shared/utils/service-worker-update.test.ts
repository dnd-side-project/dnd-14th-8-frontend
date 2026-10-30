import { describe, expect, it, vi } from "vitest";
import { createUpdateNotifier } from "@/shared/utils/service-worker-update";

function setup() {
  const showPrompt = vi.fn();
  const updateSW = vi.fn();
  const notifier = createUpdateNotifier({ showPrompt, updateSW });

  return { notifier, showPrompt, updateSW };
}

describe("createUpdateNotifier", () => {
  it("asks the user instead of reloading by itself", () => {
    const { notifier, showPrompt, updateSW } = setup();

    notifier.notify();

    expect(showPrompt).toHaveBeenCalledTimes(1);
    // 여러 단계 입력 폼이 있는 앱이라 스스로 새로고침하면 안 된다.
    expect(updateSW).not.toHaveBeenCalled();
  });

  it("applies the update only once the user chooses to refresh", () => {
    const { notifier, updateSW } = setup();

    notifier.notify();
    notifier.applyUpdate();

    // true는 갱신 후 페이지를 새로 불러오라는 뜻이다.
    expect(updateSW).toHaveBeenCalledWith(true);
  });

  it("holds the notice back while another bottom sheet owns the screen", () => {
    const { notifier, showPrompt } = setup();

    notifier.setBlocked(true);
    notifier.notify();

    expect(showPrompt).not.toHaveBeenCalled();
  });

  it("releases the held notice once the sheet closes", () => {
    const { notifier, showPrompt } = setup();

    notifier.setBlocked(true);
    notifier.notify();
    notifier.setBlocked(false);

    expect(showPrompt).toHaveBeenCalledTimes(1);
  });

  it("does not invent a notice that was never needed", () => {
    const { notifier, showPrompt } = setup();

    notifier.setBlocked(true);
    notifier.setBlocked(false);

    expect(showPrompt).not.toHaveBeenCalled();
  });

  it("shows the notice only once even if the sheet reopens and closes again", () => {
    const { notifier, showPrompt } = setup();

    notifier.setBlocked(true);
    notifier.notify();
    notifier.setBlocked(false);
    notifier.setBlocked(true);
    notifier.setBlocked(false);

    expect(showPrompt).toHaveBeenCalledTimes(1);
  });
});
