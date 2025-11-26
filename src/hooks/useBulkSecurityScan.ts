import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SecurityScanResult {
  url: string;
  is_safe: boolean | null;
  threats: any | null;
  isScanning: boolean;
  scanned: boolean;
}

export const useBulkSecurityScan = () => {
  const [scanResults, setScanResults] = useState<Map<string, SecurityScanResult>>(new Map());

  const scanURL = useCallback(async (url: string) => {
    // Set scanning state
    setScanResults(prev => new Map(prev).set(url, {
      url,
      is_safe: null,
      threats: null,
      isScanning: true,
      scanned: false,
    }));

    try {
      const { data, error } = await supabase.functions.invoke('scan-url', {
        body: { url },
      });

      if (!error && data) {
        setScanResults(prev => new Map(prev).set(url, {
          url,
          is_safe: data.safe,
          threats: data.threats,
          isScanning: false,
          scanned: true,
        }));
      } else {
        setScanResults(prev => new Map(prev).set(url, {
          url,
          is_safe: null,
          threats: null,
          isScanning: false,
          scanned: false,
        }));
      }
    } catch (err) {
      setScanResults(prev => new Map(prev).set(url, {
        url,
        is_safe: null,
        threats: null,
        isScanning: false,
        scanned: false,
      }));
    }
  }, []);

  const scanMultipleURLs = useCallback(async (urls: string[]) => {
    // Scan in batches of 3 to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await Promise.all(batch.map(url => scanURL(url)));
    }
  }, [scanURL]);

  const getSecurityStats = useCallback(() => {
    const scanned = Array.from(scanResults.values()).filter(r => r.scanned).length;
    const safe = Array.from(scanResults.values()).filter(r => r.is_safe === true).length;
    const threats = Array.from(scanResults.values()).filter(r => r.is_safe === false).length;
    const httpsCount = Array.from(scanResults.keys()).filter(url => url.startsWith('https://')).length;

    return { scanned, safe, threats, httpsCount, total: scanResults.size };
  }, [scanResults]);

  return {
    scanResults,
    scanURL,
    scanMultipleURLs,
    getSecurityStats,
  };
};
