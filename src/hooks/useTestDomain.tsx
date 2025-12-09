import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TestResult {
  step: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export interface DomainTestResponse {
  domain: string;
  isSubdomain: boolean;
  overallStatus: 'pass' | 'fail' | 'warning';
  results: TestResult[];
  testLink: string;
  recommendation: string;
}

interface UseTestDomainOptions {
  autoPolling?: boolean;
  pollingInterval?: number;
  onSuccess?: (result: DomainTestResponse) => void;
}

export function useTestDomain(options: UseTestDomainOptions = {}) {
  const { 
    autoPolling = false, 
    pollingInterval = 30000,
    onSuccess
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DomainTestResponse | null>(null);
  const [pollCount, setPollCount] = useState(0);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<string | null>(null);

  const testDomain = useCallback(async (domain: string): Promise<DomainTestResponse | null> => {
    if (!domain) {
      setError('Domain is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('test-domain', {
        body: { domain: domain.toLowerCase().trim() }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to test domain');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as DomainTestResponse);
      setPollCount(prev => prev + 1);

      // Check if status improved
      if (previousStatusRef.current && 
          previousStatusRef.current !== 'pass' && 
          data.overallStatus === 'pass') {
        onSuccess?.(data);
      }
      previousStatusRef.current = data.overallStatus;

      return data as DomainTestResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  const startPolling = useCallback((domain: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // Run immediately
    testDomain(domain);

    // Then poll at interval
    pollingRef.current = setInterval(() => {
      testDomain(domain);
    }, pollingInterval);
  }, [testDomain, pollingInterval]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setPollCount(0);
    previousStatusRef.current = null;
    stopPolling();
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    testDomain,
    isLoading,
    error,
    result,
    pollCount,
    startPolling,
    stopPolling,
    reset,
    isPolling: pollingRef.current !== null
  };
}
