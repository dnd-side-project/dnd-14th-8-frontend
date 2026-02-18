import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, type PropsWithChildren, Suspense } from "react";

const TanstackReactQueryDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import("@tanstack/react-query-devtools");
      return { default: module.ReactQueryDevtools };
    })
  : null;

export interface TanstackQueryProviderProps extends PropsWithChildren {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function TanstackQueryProvider({
  children,
}: TanstackQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <TanstackQueryDevtools />
    </QueryClientProvider>
  );
}

function TanstackQueryDevtools() {
  if (!import.meta.env.DEV || TanstackReactQueryDevtools === null) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TanstackReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  );
}
