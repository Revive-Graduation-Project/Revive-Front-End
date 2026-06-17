import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuUploads, uploadMenuFile } from "../../services/dashboardService";

export const menuUploadKeys = {
  all: ["menu-uploads"],
};

export function useMenuUploads() {
  return useQuery({
    queryKey: menuUploadKeys.all,
    queryFn: getMenuUploads,
  });
}

/** Mutation: upload a menu file (Excel/CSV) */
export function useUploadMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadMenuFile,
    onSettled: () => qc.invalidateQueries({ queryKey: menuUploadKeys.all }),
  });
}
