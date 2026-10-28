import { cn } from "@/shared/utils/cn";

export interface MainButtonProps {
  title: string;
  description: string;
  graphicSrc: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  onClick?: () => void;
}

export function MainButton({
  title,
  description,
  graphicSrc,
  className,
  titleClassName,
  descriptionClassName,
  onClick,
}: MainButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      <div className="relative flex flex-col gap-1 px-6 pt-6">
        <h3 className={cn("textStyle_head4", titleClassName)}>{title}</h3>
        <p className={cn("textStyle_body5", descriptionClassName)}>
          {description}
        </p>
      </div>
    </button>
  );
}
