import { Button } from "@moyeorak/design-system";
import {
  type PropsWithChildren,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getBackendStatus,
  subscribeBackendStatus,
  warmUpBackend,
} from "@/shared/utils/backend-readiness";

export function BackendConnectionProvider({ children }: PropsWithChildren) {
  const status = useSyncExternalStore(
    subscribeBackendStatus,
    getBackendStatus,
    () => "idle",
  );
  const [showConnecting, setShowConnecting] = useState(false);

  // 랜딩처럼 API를 쓰지 않는 화면은 막지 않고, 서버만 미리 깨운다.
  // 안내 화면은 API 요청이 서버 준비를 기다릴 때만 뜬다.
  useEffect(() => {
    warmUpBackend();
  }, []);

  useEffect(() => {
    if (status !== "connecting") {
      setShowConnecting(false);
      return;
    }
    const timer = setTimeout(() => setShowConnecting(true), 1_000);
    return () => clearTimeout(timer);
  }, [status]);

  const failed = status === "error";
  const blocked = showConnecting || failed;
  return (
    <>
      <div
        className="contents"
        inert={blocked}
        aria-hidden={blocked || undefined}
      >
        {children}
      </div>
      {blocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-k-5/95 px-6">
          <div className="flex max-w-sm flex-col items-center gap-4 text-center">
            <p className="font-bold text-h2 text-primary-main">모여락</p>
            <div aria-live="polite" className="flex flex-col gap-2">
              <h1 className="font-semibold text-h3 text-k-900">
                {failed
                  ? "연결이 잠시 지연되고 있어요"
                  : "모임을 준비하고 있어요"}
              </h1>
              <p className="text-balance text-b2 text-k-700">
                {failed
                  ? "잠시 후 다시 시도해 주세요."
                  : "첫 연결에는 몇 분 정도 걸릴 수 있어요. 잠시만 기다려 주세요."}
              </p>
            </div>
            {failed && (
              <Button
                variant="brand"
                size="lg"
                type="button"
                onClick={() => window.location.reload()}
                className="focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2"
              >
                다시 연결하기
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
