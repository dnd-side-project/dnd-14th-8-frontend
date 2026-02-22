import type { DevTool } from "@hookform/devtools";
import { lazy, Suspense } from "react";
import type { FieldValues } from "react-hook-form";

const ReactHookFormDevtoolsModule = import.meta.env.DEV
  ? (lazy(async () => {
      const module = await import("@hookform/devtools");
      return { default: module.DevTool };
    }) as typeof DevTool)
  : null;

export interface ReactHookFormDevtoolsProps<TFieldValues extends FieldValues>
  extends NonNullable<Parameters<typeof DevTool<TFieldValues>>[0]> {}

export function ReactHookFormDevtools<TFieldValues extends FieldValues>(
  props: ReactHookFormDevtoolsProps<TFieldValues>,
) {
  if (!import.meta.env.DEV || ReactHookFormDevtoolsModule === null) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactHookFormDevtoolsModule {...props} />
    </Suspense>
  );
}
