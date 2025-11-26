import { useCallback } from "react";
import type { URLValidation } from "./useBulkValidation";
import type { BatchResult } from "./useBatchProcessor";

export interface BulkUploadState {
  urls: string[];
  validations: URLValidation[];
  selectedDomain: string;
  utmDefaults: Record<string, string>;
  smartOptions: Record<string, boolean>;
  folderId: string | null;
  tags: string[];
  processedCount: number;
  results: BatchResult[];
  savedAt: number;
}

const STORAGE_KEY = "bulk_upload_progress";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export const useBulkUploadPersistence = () => {
  const saveProgress = useCallback((state: Omit<BulkUploadState, "savedAt">) => {
    try {
      const dataToSave: BulkUploadState = {
        ...state,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save bulk upload progress:", error);
    }
  }, []);

  const loadProgress = useCallback((): BulkUploadState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state: BulkUploadState = JSON.parse(saved);
      
      // Check if saved state is too old
      if (Date.now() - state.savedAt > MAX_AGE_MS) {
        clearProgress();
        return null;
      }

      return state;
    } catch (error) {
      console.error("Failed to load bulk upload progress:", error);
      return null;
    }
  }, []);

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear bulk upload progress:", error);
    }
  }, []);

  const hasUnfinishedUpload = useCallback((): boolean => {
    const saved = loadProgress();
    return saved !== null && saved.processedCount < saved.urls.length;
  }, [loadProgress]);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasUnfinishedUpload,
  };
};
