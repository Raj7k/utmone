import { useState, useCallback } from "react";

export interface URLValidation {
  url: string;
  isValid: boolean;
  isDuplicate: boolean;
  domain: string | null;
  error: string | null;
}

export const useBulkValidation = () => {
  const [validations, setValidations] = useState<URLValidation[]>([]);

  const validateURL = useCallback((url: string): URLValidation => {
    let isValid = false;
    let domain = null;
    let error = null;

    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
        isValid = true;
        domain = urlObj.hostname.replace("www.", "");
      } else {
        error = "invalid protocol";
      }
    } catch (e) {
      error = "invalid URL format";
    }

    return {
      url,
      isValid,
      isDuplicate: false,
      domain,
      error,
    };
  }, []);

  const validateURLs = useCallback(
    (urls: string[]) => {
      const urlCounts = new Map<string, number>();
      
      // Count occurrences
      urls.forEach((url) => {
        const trimmedUrl = url.trim().toLowerCase();
        urlCounts.set(trimmedUrl, (urlCounts.get(trimmedUrl) || 0) + 1);
      });

      // Validate each URL and mark duplicates
      const validated = urls.map((url) => {
        const trimmedUrl = url.trim();
        const validation = validateURL(trimmedUrl);
        const isDuplicate = urlCounts.get(trimmedUrl.toLowerCase())! > 1;

        return {
          ...validation,
          isDuplicate,
        };
      });

      setValidations(validated);
      return validated;
    },
    [validateURL]
  );

  const getStats = useCallback(() => {
    const total = validations.length;
    const valid = validations.filter((v) => v.isValid && !v.isDuplicate).length;
    const duplicates = validations.filter((v) => v.isDuplicate).length;
    const invalid = validations.filter((v) => !v.isValid).length;
    const uniqueDomains = new Set(
      validations.filter((v) => v.domain).map((v) => v.domain)
    ).size;

    return { total, valid, duplicates, invalid, uniqueDomains };
  }, [validations]);

  return {
    validations,
    validateURLs,
    getStats,
  };
};
