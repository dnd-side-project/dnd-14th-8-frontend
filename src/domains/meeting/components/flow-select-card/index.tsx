import { useId } from "react";
import { cn } from "@/shared/utils/cn";

export interface FlowSelectCardProps {
  title: string;
  description: string;
  graphicSrc: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  onClick?: () => void;
}

export function FlowSelectCard({
  title,
  description,
  graphicSrc,
  className,
  titleClassName,
  descriptionClassName,
  onClick,
}: FlowSelectCardProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <button
      type="button"
      onClick={onClick}
      // 이름은 제목만 쓰고, 설명은 이름 뒤에 따로 읽히게 연결한다.
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn(
        "relative flex aspect-[335/140] w-full cursor-pointer flex-col rounded-xl text-left",
        "transition-transform active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2",
        className,
      )}
    >
      <img
        src={graphicSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full select-none rounded-xl"
      />
      <span className="relative flex flex-col gap-1 px-6 pt-6">
        <span id={titleId} className={cn("textStyle_head4", titleClassName)}>
          {title}
        </span>
        <span
          id={descriptionId}
          className={cn("textStyle_body5", descriptionClassName)}
        >
          {description}
        </span>
      </span>
    </button>
  );
}
