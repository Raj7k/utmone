import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AISuggestions {
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  vanity_slugs: string[];
  context: string;
}

export interface AIAnalysisResult {
  success: boolean;
  ai_powered: boolean;
  suggestions: AISuggestions;
  metadata: {
    page_title: string;
    page_description: string;
  };
}

export function useAIAnalyzeUrl() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const analyzeUrl = useCallback(async (url: string) => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return;
    }

    // Debounce the request
    debounceRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsAnalyzing(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('analyze-url', {
          body: { url },
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.success) {
          setSuggestions(data.suggestions);
          setIsAIPowered(data.ai_powered);
        } else {
          setError(data?.error || 'Analysis failed');
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
          console.error('AI analysis error:', err);
        }
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions(null);
    setError(null);
    setIsAIPowered(false);
  }, []);

  return {
    isAnalyzing,
    suggestions,
    error,
    isAIPowered,
    analyzeUrl,
    clearSuggestions,
  };
}
