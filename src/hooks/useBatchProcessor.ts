import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BatchResult {
  url: string;
  success: boolean;
  shortUrl?: string;
  slug?: string;
  error?: string;
}

interface ProcessingState {
  stage: "idle" | "parsing" | "validating" | "creating" | "complete" | "error";
  currentBatch: number;
  totalBatches: number;
  processedCount: number;
  totalCount: number;
}

export const useBatchProcessor = (workspaceId: string, batchSize: number = 10) => {
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
    retries: number = 3
  ): Promise<BatchResult[]> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke("bulk-create-links", {
          body: {
            workspace_id: workspaceId,
            domain,
            links: batch,
          },
        });

        if (error) throw error;

        return data.results.map((result: any) => ({
          url: result.destination_url,
          success: result.success,
          shortUrl: result.link ? `https://${domain}/${result.link.slug}` : undefined,
          slug: result.link?.slug,
          error: result.error,
        }));
      } catch (error: any) {
        if (attempt === retries) {
          return batch.map((link) => ({
            url: link.destination_url,
            success: false,
            error: `failed after ${retries} attempts: ${error.message}`,
          }));
        }
        // Exponential backoff
        await sleep(1000 * attempt);
      }
    }
    return [];
  };

  const processURLs = useCallback(
    async (links: any[], domain: string) => {
      setState({
        stage: "parsing",
        currentBatch: 0,
        totalBatches: Math.ceil(links.length / batchSize),
        processedCount: 0,
        totalCount: links.length,
      });

      await sleep(500); // Visual feedback

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
        }));

        const batchResults = await processBatch(batches[i], domain);
        allResults.push(...batchResults);

        setState((prev) => ({
          ...prev,
          processedCount: Math.min((i + 1) * batchSize, links.length),
        }));
      }

      setResults(allResults);
      setState((prev) => ({ ...prev, stage: "complete" }));

      return allResults;
    },
    [workspaceId, batchSize]
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
    reset,
  };
};
