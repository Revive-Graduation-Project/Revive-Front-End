import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../utils/toastUtils";
import {
  getMenuUploads,
  uploadMenuFile,
  validateMenuFile,
  importMenuJson,
  getImportStatus,
} from "../../services/dashboardService";
import useUIStore from "../../store/uiStore";

export const menuUploadKeys = {
  all: ["menu-uploads"],
  jobStatus: (jobId) => ["import-job-status", jobId],
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
        duration: 6000,
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
                duration: 6000,
                description: "You can navigate away while this uploads in the background."
              });
            }
          }
        });
        toast.success(`Successfully uploaded ${file.name || "Menu CSV"}!`, { id: toastId, duration: 6000, description: "Menu updated successfully." });
        useUIStore.getState().addNotification({
          title: "Menu CSV Uploaded",
          message: `File "${file.name || "Menu CSV"}" uploaded successfully. Menu items updated.`,
          type: "success",
          category: "Performance",
        });
        return result;
      } catch (err) {
        toast.error(`Failed to upload ${file.name || "Menu CSV"}.`, { id: toastId, duration: 6000, description: extractErrorMessage(err) });
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: menuUploadKeys.all });
      qc.invalidateQueries({ queryKey: ["menu"], refetchType: "all" });
      qc.invalidateQueries({ queryKey: ["ingredients"], refetchType: "all" });
    },
  });
}

/** Mutation: validate menu file (CSV) */
export function useValidateMenu() {
  return useMutation({
    mutationFn: async ({ file, existingMealNames = [] }) => {
      const result = await validateMenuFile(file);
      const existingSet = new Set(existingMealNames.map(n => n.toLowerCase()));

      const dbDuplicates = result.validMeals
        .filter(m => existingSet.has(m.mealName.toLowerCase()))
        .map(m => ({ mealName: m.mealName, reason: "Already exists in system" }));

      const uniqueValidMeals = result.validMeals
        .filter(m => !existingSet.has(m.mealName.toLowerCase()));

      return {
        validMeals: uniqueValidMeals,
        invalidMeals: [...result.invalidMeals, ...dbDuplicates],
      };
    },
  });
}

function extractErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Please try again.";
}

/**
 * Mutation: import menu JSON.
 * Returns immediately (202) with a jobId. The modal closes and the uploads
 * table row polls for the final status via useImportJobStatus.
 */
export function useImportMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importMenuJson,
    onSuccess: (data, variables, context) => {
      toast.success("Import queued!", {
        description: `${data.mealCount} meals are being processed in the background.`,
        duration: 5000,
      });
      useUIStore.getState().addNotification({
        title: "Menu CSV Import Queued",
        message: `Processing ${data.mealCount} meals in the background.`,
        type: "info",
        category: "Performance",
      });

      // Persist the jobId in the upload's localStorage entry so the table can poll
      if (data.jobId) {
        const uploads = JSON.parse(localStorage.getItem("menuUploads") || "[]");
        // Tag the most-recent entry (the one just submitted) with the jobId
        const [latest, ...rest] = uploads;
        if (latest) {
          const updated = { ...latest, jobId: data.jobId, importStatus: "processing" };
          localStorage.setItem("menuUploads", JSON.stringify([updated, ...rest]));
        }
      }
    },
    onError: (err) => {
      toast.error("Import failed.", {
        description: extractErrorMessage(err),
        duration: 8000,
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: menuUploadKeys.all });
    },
  });
}

/**
 * Query: polls GET /import-status/{jobId} every 3 seconds until terminal.
 * When DONE → success toast + updates localStorage row.
 * When FAILED → error toast + updates localStorage row with message.
 */
export function useImportJobStatus(jobId) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: menuUploadKeys.jobStatus(jobId),
    queryFn: () => getImportStatus(jobId),
    enabled: !!jobId,
    // Stop polling once a terminal state is reached
    refetchInterval: (query) => {
      const state = query.state?.data?.state;
      return state === "DONE" || state === "FAILED" ? false : 3000;
    },
    onSuccess: (data) => {
      if (data.state === "DONE") {
        toast.success("Import complete!", {
          description: "All meals have been processed and added to the menu.",
          duration: 6000,
        });
        _updateUploadEntryStatus(jobId, "success", null);
        qc.invalidateQueries({ queryKey: ["menu"], refetchType: "all" });
        qc.invalidateQueries({ queryKey: ["ingredients"], refetchType: "all" });
      } else if (data.state === "FAILED") {
        toast.error("Import failed.", {
          description: data.errorMessage || "An error occurred during processing.",
          duration: 10000,
        });
        _updateUploadEntryStatus(jobId, "failed", data.errorMessage);
      }
    },
  });
}

/** Updates the importStatus field of the localStorage upload entry matching jobId. */
function _updateUploadEntryStatus(jobId, importStatus, errorMessage) {
  try {
    const uploads = JSON.parse(localStorage.getItem("menuUploads") || "[]");
    const updated = uploads.map(u =>
      u.jobId === jobId ? { ...u, importStatus, errorMessage } : u
    );
    localStorage.setItem("menuUploads", JSON.stringify(updated));
  } catch {
    // Non-critical — localStorage failure should not crash the app
  }
}
