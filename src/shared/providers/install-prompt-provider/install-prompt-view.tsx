import { ButtonBottom } from "@/shared/components/button-bottom";
import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon, PlusIcon, ShareIcon } from "@/shared/components/icons";
import type { InstallPromptMode } from "@/shared/providers/install-prompt-provider/install-availability";
import { cn } from "@/shared/utils/cn";

interface InstallPromptViewProps {
  isMounted: boolean;
  isOpen: boolean;
  mode: InstallPromptMode;
  onClose: () => void;
  onInstall: () => void;
}

export function InstallPromptView({
  isMounted,
  isOpen,
  mode,
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
        "fixed right-0 bottom-0 left-0 z-100 mx-auto w-full overflow-hidden rounded-t-[20px] bg-k-5",
        "shadow-[0_-4px_20px_0_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:max-w-[375px]",
        isOpen ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-start gap-3 px-5 pt-5">
        {/* 홈 화면에 실제로 추가될 아이콘을 그대로 보여준다. */}
        <img
          alt=""
          className="size-11 shrink-0 rounded-xl border border-k-100"
          src="/favicon-192.png"
        />

        <div className="flex flex-col gap-1 break-keep pt-0.5">
          <h2 className="text-k-900 text-t1">홈 화면에 모여락 추가하기</h2>
          <p className="text-b2 text-k-600">
            앱처럼 바로 열어서 모임 일정과 장소를 확인할 수 있어요
          </p>
        </div>

        <IconButton
          aria-label="닫기"
          background="circle"
          backgroundSize="sm"
          className="ml-auto shrink-0"
          icon={CloseIcon}
          iconSize="sm"
          onClick={onClose}
          size="lg"
          variant="neutral"
        />
      </div>

      {mode === "guide" ? (
        <div className="px-5 pt-4 pb-7">
          <ol className="flex flex-col gap-2 rounded-xl bg-k-10 px-4 py-3.5">
            <li className="flex items-center gap-2 break-keep text-b2 text-k-700">
              <span className="text-k-900 text-t3">1</span>
              하단의 공유 버튼
              <ShareIcon className="size-4 shrink-0" aria-hidden="true" />를
              눌러주세요
            </li>
            <li className="flex items-center gap-2 break-keep text-b2 text-k-700">
              <span className="text-k-900 text-t3">2</span>
              <PlusIcon className="size-4 shrink-0" aria-hidden="true" />
              &lsquo;홈 화면에 추가&rsquo;를 선택해주세요
            </li>
          </ol>

          <ButtonBottom className="mt-4" onClick={onClose} variant="white">
            확인했어요
          </ButtonBottom>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-5 pt-4 pb-7">
          <ButtonBottom onClick={onInstall} variant="blue">
            홈 화면에 추가
          </ButtonBottom>
          <ButtonBottom onClick={onClose} variant="white">
            다음에 할게요
          </ButtonBottom>
        </div>
      )}
    </section>
  );
}
