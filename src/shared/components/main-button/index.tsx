import { cn } from "@/shared/utils/cn";

export interface MainButtonProps {
  title?: string;
  description?: string;
  imgSrc?: string;
  className?: string;
  onClick?: () => void;
}

export function MainButton({
  title,
  description,
  imgSrc,
  className,
  onClick,
}: MainButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "cusor-pointer h-[160px] w-full rounded-xl py-[26px] pr-[15px] pl-7 shadow-[0_3px_6px_0_#CACACA]",
        "flex items-center justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-h3 text-k-5">{title}</h3>
        <p className="whitespace-pre-line text-b2 text-k-5">{description}</p>
      </div>

      {imgSrc && (
        <div className="shrink-0">
          <img
            src={imgSrc}
            alt={title}
            className="h-[108px] w-[148px] object-contain"
          />
        </div>
      )}
    </button>
  );
}
