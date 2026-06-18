import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuUploads, uploadMenuFile } from "../../services/dashboardService";

export const menuUploadKeys = {
  all: ["menu-uploads"],
};

/**
 * Retrieves menu uploads from the server.
 * @return {Object} The query result containing the menu uploads and query state.
 */
export function useMenuUploads() {
  return useQuery({
    queryKey: menuUploadKeys.all,
    queryFn: getMenuUploads,
  });
}

/**
 * Creates a mutation for uploading a menu file.
 * The menu uploads list is automatically refetched when the upload completes.
 * @return {Object} A mutation object with methods to manage the file upload.
 */
export function useUploadMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadMenuFile,
    onSettled: () => qc.invalidateQueries({ queryKey: menuUploadKeys.all }),
  });
}
