import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh (no automatic refetch)
      staleTime: 5 * 60 * 1000, // 5 minutes

      // How long inactive cache data stays in memory before garbage collection
      cacheTime: 30 * 60 * 1000, // 30 minutes

      // Prevent automatic refetch when window regains focus
      refetchOnWindowFocus: false,

      // Number of retry attempts if query fails
      retry: 1,

    },
    mutations: {
      // Usually, we do not retry mutations on failure to avoid unintended side effects
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
);
