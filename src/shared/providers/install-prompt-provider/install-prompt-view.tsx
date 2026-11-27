import { Button } from "@moyeorak/design-system";
import type {
  InstallPromptMode,
  ShareStep,
} from "@/shared/providers/install-prompt-provider/install-availability";
import { cn } from "@/shared/utils/cn";

/** 단계 안내 1단계. 공유를 찾는 곳이 Safari 버전마다 달라 나눈다(`resolveShareStep`). */
const SHARE_STEP_COPY: Record<ShareStep, string> = {
  toolbar: "아래 막대의 공유 버튼을 눌러주세요",
  more: "점 세 개 버튼을 눌러 공유를 눌러주세요",
  pageMenu: "주소창 왼쪽 버튼을 눌러 공유를 눌러주세요",
  other: "공유 버튼을 눌러주세요",
};

interface InstallPromptViewProps {
  isMounted: boolean;
  isOpen: boolean;
  mode: InstallPromptMode;
  shareStep: ShareStep;
  onClose: () => void;
  onInstall: () => void;
}

export function InstallPromptView({
  isMounted,
  isOpen,
  mode,
  shareStep,
  onClose,
  onInstall,
}: InstallPromptViewProps) {
  if (!isMounted || mode === "hidden") {
    return null;
  }

  return (
    <section
      aria-label="홈 화면에 추가"
      className={cn(
        "fixed right-0 bottom-0 left-0 z-100 mx-auto w-full overflow-hidden rounded-t-[20px] bg-bg-neutral-default",
        "shadow-[0_-4px_20px_0_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:max-w-[375px]",
        isOpen ? "translate-y-0" : "translate-y-full",
      )}
    >
      {/* 오른쪽 위 닫기 버튼은 두지 않는다. 아래 버튼("확인", "나중에")과 하는 일이 같아서 닫는 버튼을 하나로 줄였다(#293). Escape 키로도 닫힌다. */}
      <div className="flex flex-col items-center gap-3 px-5 pt-5 text-center">
        {/* 홈 화면에 실제로 추가될 아이콘을 그대로 보여준다. */}
        <img
          alt=""
          className="size-11 shrink-0 rounded-xl border border-stroke-neutral-subtle"
          src="/favicon-192.png"
        />

        <div className="flex flex-col items-center gap-1 break-keep pt-0.5">
          <h2 className="textStyle_title1 text-fg-neutral-stronger">
            홈 화면에 모여락 추가하기
          </h2>
          <p className="textStyle_body2 text-fg-neutral-subtle">
            모임 일정과 장소를 앱처럼 확인할 수 있어요
          </p>
        </div>
      </div>

      {mode === "guide" ? (
        <div className="px-5 pt-4 pb-[max(28px,env(safe-area-inset-bottom))]">
          {/* 번호는 숫자 폭을 같게 한다. 숫자마다 폭이 달라 "1."과 "2." 뒤 글자의 시작 위치가 3px 어긋났다. */}
          <ol className="flex flex-col gap-2 rounded-xl bg-fill-neutral-subtlest px-4 py-3.5">
            <li className="textStyle_body2 flex items-center gap-2 break-keep text-fg-neutral-default">
              <span className="text-fg-neutral-stronger text-t3 tabular-nums">
                1.
              </span>
              {SHARE_STEP_COPY[shareStep]}
            </li>
            <li className="textStyle_body2 flex items-center gap-2 break-keep text-fg-neutral-default">
              <span className="text-fg-neutral-stronger text-t3 tabular-nums">
                2.
              </span>
              목록을 내려 &lsquo;홈 화면에 추가&rsquo;를 선택해주세요
            </li>
          </ol>

          <Button
            className="mt-4"
            onClick={onClose}
            variant="brand"
            size="xl"
            display="full"
          >
            확인
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-5 pt-4 pb-[max(28px,env(safe-area-inset-bottom))]">
          <Button onClick={onInstall} variant="brand" size="xl" display="full">
            홈 화면에 추가
          </Button>
          <Button onClick={onClose} variant="outline" size="xl" display="full">
            나중에
          </Button>
        </div>
      )}
    </section>
  );
}
