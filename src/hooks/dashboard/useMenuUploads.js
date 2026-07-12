import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../utils/toastUtils";
import {
  uploadMenuFile,
  validateMenuFile,
  importMenuJson,
  getImportJobStatus,
  getActiveImportJob,
  getAllImportJobs,
  cancelImportJob,
} from "../../services/dashboardService";
import useUIStore from "../../store/uiStore";

export const menuUploadKeys = {
  all: ["menu-uploads"],
  jobs: ["import-jobs"],
  active: ["import-jobs", "active"],
  job: (id) => ["import-jobs", id],
};

// ── All import jobs (for the Recent Uploads table) ─────────────────────────
export function useImportJobs() {
  return useQuery({
    queryKey: menuUploadKeys.jobs,
    queryFn: getAllImportJobs,
    staleTime: 5_000,
  });
}

// ── Legacy: kept for any code that still calls useMenuUploads() ─────────────
export function useMenuUploads() {
  return useImportJobs();
}

// ── Active job check (called on mount to detect in-progress imports) ────────
export function useActiveImportJob() {
  return useQuery({
    queryKey: menuUploadKeys.active,
    queryFn: getActiveImportJob,
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
  });
}

// ── Polling a specific job's status ─────────────────────────────────────────
export function useImportJobPolling(jobId, enabled = true) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: menuUploadKeys.job(jobId),
    queryFn: () => getImportJobStatus(jobId),
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling once terminal state is reached
      if (status === "COMPLETED" || status === "FAILED" || status === "CANCELED") {
        qc.invalidateQueries({ queryKey: menuUploadKeys.jobs });
        qc.invalidateQueries({ queryKey: menuUploadKeys.active });
        return false;
      }
      return 2_000; // Poll every 2 seconds
    },
    staleTime: 0,
  });
}

// ── Cancel an import job ─────────────────────────────────────────────────────
export function useCancelImportJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelImportJob,
    onSuccess: () => {
      toast.success("Import cancelled.");
      qc.invalidateQueries({ queryKey: menuUploadKeys.jobs });
      qc.invalidateQueries({ queryKey: menuUploadKeys.active });
    },
    onError: () => {
      toast.error("Failed to cancel import.");
    },
  });
}

// ── Mutation: upload file (kept for backward compat) ────────────────────────
export function useUploadMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fileOrPayload) => {
      const file = fileOrPayload?.file || fileOrPayload;
      const toastId = toast.loading(`Uploading ${file.name || "Menu CSV"} (0%)...`, {
        duration: 6000,
        description: "You can navigate away while this uploads in the background.",
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
                description: "You can navigate away while this uploads in the background.",
              });
            }
          },
        });
        toast.success(`Successfully uploaded ${file.name || "Menu CSV"}!`, {
          id: toastId,
          duration: 6000,
          description: "Menu updated successfully.",
        });
        useUIStore.getState().addNotification({
          title: "Menu CSV Uploaded",
          message: `File "${file.name || "Menu CSV"}" uploaded successfully. Menu items updated.`,
          type: "success",
          category: "Performance",
        });
        return result;
      } catch (err) {
        toast.error(`Failed to upload ${file.name || "Menu CSV"}.`, {
          id: toastId,
          duration: 6000,
          description: err?.response?.data?.message || err.message || "Please try again.",
        });
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: menuUploadKeys.jobs });
      qc.invalidateQueries({ queryKey: ["menu"], refetchType: "all" });
      qc.invalidateQueries({ queryKey: ["ingredients"], refetchType: "all" });
    },
  });
}

// ── Mutation: validate file ──────────────────────────────────────────────────
export function useValidateMenu() {
  return useMutation({
    mutationFn: async ({ file, existingMealNames = [] }) => {
      const result = await validateMenuFile(file);
      const existingSet = new Set(existingMealNames.map((n) => n.toLowerCase()));
      const dbDuplicates = result.validMeals
        .filter((m) => existingSet.has(m.mealName.toLowerCase()))
        .map((m) => ({ mealName: m.mealName, reason: "Already exists in system" }));
      const trueValid = result.validMeals.filter(
        (m) => !existingSet.has(m.mealName.toLowerCase())
      );
      return {
        validMeals: trueValid,
        invalidMeals: [...result.invalidMeals, ...dbDuplicates],
      };
    },
  });
}

function extractErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Please try again.";
}

// ── Mutation: import JSON — now returns jobId from backend ──────────────────
export function useImportMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importMenuJson,
    onSuccess: (data) => {
      // data.jobId is returned by the new backend
      toast.success("Import started!", {
        description: data.message || "Your menu will update shortly.",
        duration: 6000,
      });
      useUIStore.getState().addNotification({
        title: "Menu CSV Imported",
        message: data.message || "Menu items are being processed.",
        type: "success",
        category: "Performance",
      });
    },
    onError: (err) => {
      toast.error("Import failed.", {
        description: extractErrorMessage(err),
        duration: 8000,
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: menuUploadKeys.jobs });
      qc.invalidateQueries({ queryKey: menuUploadKeys.active });
    },
  });
}
