import { describe, expect, it, vi } from "vitest";
import { createUpdateNotifier } from "@/shared/utils/service-worker-update";

function setup() {
  const showToast = vi.fn();
  const updateSW = vi.fn();
  const notifier = createUpdateNotifier({ showToast, updateSW });

  return { notifier, showToast, updateSW };
}

describe("createUpdateNotifier", () => {
  it("keeps the notice on screen until the user acts on it", () => {
    const { notifier, showToast } = setup();

    notifier.notify();

    expect(showToast).toHaveBeenCalledTimes(1);
    const [, options] = showToast.mock.calls[0];
    // 여러 단계 입력 폼이 있는 앱이라 스스로 사라지면 안 된다.
    expect(options.duration).toBe(Number.POSITIVE_INFINITY);
  });

  it("applies the update only once the user presses the action", () => {
    const { notifier, showToast, updateSW } = setup();

    notifier.notify();
    expect(updateSW).not.toHaveBeenCalled();

    const [, options] = showToast.mock.calls[0];
    options.action.onClick();

    // true는 갱신 후 페이지를 새로 불러오라는 뜻이다.
    expect(updateSW).toHaveBeenCalledWith(true);
  });

  it("holds the notice back while another bottom sheet owns the screen", () => {
    const { notifier, showToast } = setup();

    notifier.setBlocked(true);
    notifier.notify();

    expect(showToast).not.toHaveBeenCalled();
  });

  it("releases the held notice once the sheet closes", () => {
    const { notifier, showToast } = setup();

    notifier.setBlocked(true);
    notifier.notify();
    notifier.setBlocked(false);

    expect(showToast).toHaveBeenCalledTimes(1);
  });

  it("does not invent a notice that was never needed", () => {
    const { notifier, showToast } = setup();

    notifier.setBlocked(true);
    notifier.setBlocked(false);

    expect(showToast).not.toHaveBeenCalled();
  });

  it("shows the notice only once even if the sheet reopens and closes again", () => {
    const { notifier, showToast } = setup();

    notifier.setBlocked(true);
    notifier.notify();
    notifier.setBlocked(false);
    notifier.setBlocked(true);
    notifier.setBlocked(false);

    expect(showToast).toHaveBeenCalledTimes(1);
  });
});
