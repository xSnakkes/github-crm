import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const withProviders = (component: ReactNode) => (
  <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
);
