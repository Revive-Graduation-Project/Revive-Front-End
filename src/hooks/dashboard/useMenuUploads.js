import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMenuUploads, uploadMenuFile } from "../../services/dashboardService";
import useUIStore from "../../store/uiStore";

export const menuUploadKeys = {
  all: ["menu-uploads"],
};

export function useMenuUploads() {
  return useQuery({
    queryKey: menuUploadKeys.all,
    queryFn: getMenuUploads,
  });
}

/** Mutation: upload a menu file (Excel/CSV) with background progress toast */
export function useUploadMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fileOrPayload) => {
      const file = fileOrPayload?.file || fileOrPayload;
      const toastId = toast.loading(`Uploading ${file.name || "Menu CSV"} (0%)...`, {
        description: "You can navigate away while this uploads in the background."
      });

      try {
        const result = await uploadMenuFile({
          file,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              toast.loading(`Uploading ${file.name || "Menu CSV"} (${percent}%)...`, {
                id: toastId,
                description: "You can navigate away while this uploads in the background."
              });
            }
          }
        });
        toast.success(`Successfully uploaded ${file.name || "Menu CSV"}!`, { id: toastId, description: "Menu updated successfully." });
        useUIStore.getState().addNotification({
          title: "Menu CSV Uploaded",
          message: `File "${file.name || "Menu CSV"}" uploaded successfully. Menu items updated.`,
          type: "success",
          category: "Performance",
        });
        return result;
      } catch (err) {
        toast.error(`Failed to upload ${file.name || "Menu CSV"}.`, { id: toastId, description: err?.response?.data?.message || err.message || "Please try again." });
        throw err;
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: menuUploadKeys.all }),
  });
}
