import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BatchResult } from "./useBatchProcessor";

interface ProcessingState {
  stage: "idle" | "parsing" | "validating" | "creating" | "complete" | "error";
  currentBatch: number;
  totalBatches: number;
  processedCount: number;
  totalCount: number;
  retryAttempt?: number;
}

export const useEnhancedBatchProcessor = (workspaceId: string, batchSize: number = 10) => {
  const [state, setState] = useState<ProcessingState>({
    stage: "idle",
    currentBatch: 0,
    totalBatches: 0,
    processedCount: 0,
    totalCount: 0,
  });
  const [results, setResults] = useState<BatchResult[]>([]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const processBatch = async (
    batch: any[],
    domain: string,
    folderId?: string | null,
    tags?: string[],
    retries: number = 3
  ): Promise<BatchResult[]> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setState(prev => ({ ...prev, retryAttempt: attempt }));

        const { data, error } = await supabase.functions.invoke("bulk-create-links", {
          body: {
            workspace_id: workspaceId,
            domain,
            links: batch,
            folder_id: folderId,
            tags: tags || [],
          },
        });

        if (error) throw error;

        return data.results.map((result: any) => ({
          url: result.destination_url,
          success: result.success,
          shortUrl: result.link ? `https://${domain}/${result.link.slug}` : undefined,
          slug: result.link?.slug,
          linkId: result.link?.id,
          error: result.error,
        }));
      } catch (error: any) {
        const isRateLimitError = error.message?.includes("rate limit") || error.message?.includes("429");
        const isNetworkError = error.message?.includes("network") || error.message?.includes("fetch");
        
        if (attempt === retries) {
          return batch.map((link) => ({
            url: link.destination_url,
            success: false,
            error: isRateLimitError 
              ? "Rate limit exceeded. Please wait and retry."
              : isNetworkError
              ? "Network error. Check connection and retry."
              : `Failed after ${retries} attempts: ${error.message}`,
          }));
        }

        // Exponential backoff with jitter
        const baseDelay = 1000 * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 500;
        await sleep(baseDelay + jitter);
      }
    }
    return [];
  };

  const processURLs = useCallback(
    async (links: any[], domain: string, folderId?: string | null, tags?: string[]) => {
      setState({
        stage: "parsing",
        currentBatch: 0,
        totalBatches: Math.ceil(links.length / batchSize),
        processedCount: 0,
        totalCount: links.length,
      });

      await sleep(500);

      setState((prev) => ({ ...prev, stage: "validating" }));
      await sleep(500);

      setState((prev) => ({ ...prev, stage: "creating" }));

      const batches: any[][] = [];
      for (let i = 0; i < links.length; i += batchSize) {
        batches.push(links.slice(i, i + batchSize));
      }

      const allResults: BatchResult[] = [];

      for (let i = 0; i < batches.length; i++) {
        setState((prev) => ({
          ...prev,
          currentBatch: i + 1,
          processedCount: i * batchSize,
          retryAttempt: undefined,
        }));

        const batchResults = await processBatch(batches[i], domain, folderId, tags);
        allResults.push(...batchResults);

        setState((prev) => ({
          ...prev,
          processedCount: Math.min((i + 1) * batchSize, links.length),
        }));

        // Rate limiting protection: add delay between batches
        if (i < batches.length - 1) {
          await sleep(100);
        }
      }

      setResults(allResults);
      setState((prev) => ({ ...prev, stage: "complete", retryAttempt: undefined }));

      return allResults;
    },
    [workspaceId, batchSize]
  );

  const retryFailed = useCallback(
    async (failedUrls: string[], domain: string, folderId?: string | null, tags?: string[]) => {
      const linksToRetry = failedUrls.map(url => ({
        destination_url: url,
        title: url,
      }));

      return processURLs(linksToRetry, domain, folderId, tags);
    },
    [processURLs]
  );

  const reset = useCallback(() => {
    setState({
      stage: "idle",
      currentBatch: 0,
      totalBatches: 0,
      processedCount: 0,
      totalCount: 0,
    });
    setResults([]);
  }, []);

  return {
    state,
    results,
    processURLs,
    retryFailed,
    reset,
  };
};
