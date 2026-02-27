import type { ReactNode } from "react";

export function PlaceholderContent({
  graphic,
  title,
  description,
}: {
  graphic?: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="grid min-h-0 flex-1 place-items-center">
      <div className="flex flex-col items-center text-center">
        {graphic}
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-k-700 text-t1">{title}</p>
          <p className="text-b4 text-k-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
