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
  const previousSuggestionsRef = useRef<string[]>([]);

  const analyzeUrl = useCallback(async (url: string, regenerate = false) => {
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

    // Skip debounce for regenerate requests
    const delay = regenerate ? 0 : 500;

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
          body: { 
            url,
            regenerate,
            previousSuggestions: regenerate ? previousSuggestionsRef.current : []
          },
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.success) {
          const newSuggestions = data.suggestions;
          setSuggestions(newSuggestions);
          setIsAIPowered(data.ai_powered);
          
          // Track suggestions for deduplication on next regenerate
          const tracked: string[] = [];
          if (newSuggestions.utm_campaign) tracked.push(`campaign:${newSuggestions.utm_campaign}`);
          if (newSuggestions.utm_content) tracked.push(`content:${newSuggestions.utm_content}`);
          if (newSuggestions.utm_term) tracked.push(`term:${newSuggestions.utm_term}`);
          newSuggestions.vanity_slugs?.forEach((slug: string) => tracked.push(`slug:${slug}`));
          
          // Append to previous (keep last 20 to avoid huge payload)
          previousSuggestionsRef.current = [...previousSuggestionsRef.current, ...tracked].slice(-20);
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
    }, delay);
  }, []);

  const regenerateUrl = useCallback((url: string) => {
    analyzeUrl(url, true);
  }, [analyzeUrl]);

  const clearSuggestions = useCallback(() => {
    setSuggestions(null);
    setError(null);
    setIsAIPowered(false);
    previousSuggestionsRef.current = [];
  }, []);

  return {
    isAnalyzing,
    suggestions,
    error,
    isAIPowered,
    analyzeUrl,
    regenerateUrl,
    clearSuggestions,
  };
}
