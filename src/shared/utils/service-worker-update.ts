interface UpdateToastOptions {
  action: { label: string; onClick: () => void };
  duration: number;
}

interface CreateUpdateNotifierParams {
  showToast: (message: string, options: UpdateToastOptions) => void;
  /** true를 넘기면 대기 중인 워커를 활성화하고 페이지를 다시 불러온다. */
  updateSW: (reloadPage?: boolean) => void;
}

/**
 * 새 버전이 준비됐음을 알리고, 갱신 시점은 사용자에게 맡긴다.
 *
 * 자동으로 새로고침하면 모임 생성이나 출발지 입력처럼 여러 단계에 걸친 폼을
 * 채우던 중에 입력값이 날아간다. 토스트도 같은 이유로 스스로 사라지지 않는다.
 *
 * 설치 유도 시트가 열려 있는 동안에는 알림을 미뤄둔다. 둘 다 화면 하단을
 * 쓰기 때문에 겹쳐 보이고, 한 번에 하나씩 보여주는 편이 읽힌다.
 */
export function createUpdateNotifier({
  showToast,
  updateSW,
}: CreateUpdateNotifierParams) {
  let isBlocked = false;
  let isPending = false;
  let hasShown = false;

  const show = () => {
    if (hasShown) {
      return;
    }

    hasShown = true;
    isPending = false;

    showToast("새 버전이 준비됐어요", {
      action: {
        label: "새로고침",
        onClick: () => {
          updateSW(true);
        },
      },
      duration: Number.POSITIVE_INFINITY,
    });
  };

  return {
    /** 새 워커가 대기 상태가 됐을 때 부른다. */
    notify() {
      if (isBlocked) {
        isPending = true;
        return;
      }

      show();
    },

    /** 화면 하단을 점유하는 다른 UI가 열리고 닫힐 때 부른다. */
    setBlocked(blocked: boolean) {
      isBlocked = blocked;

      if (!blocked && isPending) {
        show();
      }
    },
  };
}
