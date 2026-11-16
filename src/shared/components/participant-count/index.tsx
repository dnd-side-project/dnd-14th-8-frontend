import { Icon } from "@moyeorak/design-system";
import { cn } from "@/shared/utils/cn";

const ROW = "textStyle_title3 flex items-center py-1 text-fg-neutral-strong";

/**
 * "참여자 n/m" 한 줄. 일정 화면과 장소 화면이 함께 쓴다.
 *
 * onClick을 넘길 때만 버튼이 되고 끝에 화살표가 붙는다. 누를 수 없는 사람에게
 * 버튼을 주면 화면 읽기 기능이 "버튼"이라고 읽고 포커스도 가는데, 눌러도
 * 반응이 없다. 그래서 그때는 글자로만 그린다.
 */
export function ParticipantCount({
  count,
  total,
  onClick,
}: {
  count: number;
  total: number;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Icon type="member" size="sm" />
      <span className="mr-0.5">참여자</span>
      <span className="text-fg-brand-default">{count}</span>
      <span className="mr-0.5">/{total}</span>
    </>
  );

  if (!onClick) {
    return <p className={ROW}>{content}</p>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(ROW, "cursor-pointer")}
    >
      {content}
      <Icon type="chevron_right" size="xs" variant="weak" />
    </button>
  );
}
