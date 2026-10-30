interface CreateUpdateNotifierParams {
  /** 새로고침할지 묻는 안내를 연다. */
  showPrompt: () => void;
  /** true를 넘기면 대기 중인 워커를 활성화하고 페이지를 다시 불러온다. */
  updateSW: (reloadPage?: boolean) => void;
}

/**
 * 새 버전이 준비됐음을 알리고, 갱신 시점은 사용자에게 맡긴다.
 *
 * 자동으로 새로고침하면 모임 생성이나 출발지 입력처럼 여러 단계에 걸친 폼을
 * 채우던 중에 입력값이 날아간다. 그래서 새로고침할지 묻고, 사용자가 고를 때만 갱신한다.
 * 나중을 고르면 앱을 다시 열 때 대기 중인 워커가 적용된다.
 *
 * 설치 유도 시트가 열려 있는 동안에는 알림을 미뤄둔다. 한 번에 하나씩 보여주는 편이 읽힌다.
 */
export function createUpdateNotifier({
  showPrompt,
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

    showPrompt();
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

    /** 사용자가 새로고침을 골랐을 때 부른다. */
    applyUpdate() {
      updateSW(true);
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
