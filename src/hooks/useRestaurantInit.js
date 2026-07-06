import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { menuKeys } from "./dashboard/useMenuItems";
import { getMenuItems } from "../services/dashboardService";

/**
 * Hook to prefetch meal data on app load via React Query.
 * Call this in App.jsx on mount.
 */
export const useRestaurantInit = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: menuKeys.items({}),
      queryFn: () => getMenuItems({}),
    });
  }, [queryClient]);
};

