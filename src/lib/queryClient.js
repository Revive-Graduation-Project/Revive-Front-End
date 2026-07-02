import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient instance.
 * Extracted into its own module so it can be safely imported by:
 *   - main.jsx (to pass to QueryClientProvider)
 *   - Zustand stores / services (to invalidate caches outside React)
 * This avoids a circular dependency that would occur if stores imported from main.jsx.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
