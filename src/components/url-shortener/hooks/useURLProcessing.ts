/**
 * useURLProcessing Hook
 * Handles URL validation, processing, and smart alias generation
 */

import { useCallback } from 'react';
import { generateSlugFromTitle } from '@/lib/slugify';
import { DEFAULT_DOMAIN } from '@/lib/constants';

export interface ProcessedURL {
  original: string;
  processed: string;
  slug: string;
  domain: string;
  utmParams?: Record<string, string>;
}

export interface ProcessingOptions {
  removeQueryParams?: boolean;
  autoAlias?: boolean;
  trackingParams?: boolean;
  utmDefaults?: Record<string, string>;
  domain?: string;
}

export const useURLProcessing = () => {
  const processURL = useCallback((
    url: string,
    options: ProcessingOptions = {}
  ): ProcessedURL | null => {
    try {
      const urlObj = new URL(url);
      let finalUrl = url;

      // Remove query params if requested
      if (options.removeQueryParams) {
        urlObj.search = '';
        finalUrl = urlObj.toString();
      }

      // Build UTM parameters
      const utmParams: Record<string, string> = {};
      if (options.trackingParams && options.utmDefaults) {
        Object.entries(options.utmDefaults).forEach(([key, value]) => {
          if (value) {
            utmParams[key] = value;
          }
        });
      }

      // Add UTM to URL
      if (Object.keys(utmParams).length > 0) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        const utmString = Object.entries(utmParams)
          .map(([key, value]) => `utm_${key}=${encodeURIComponent(value)}`)
          .join('&');
        finalUrl = `${finalUrl}${separator}${utmString}`;
      }

      // Generate smart alias
      const slug = options.autoAlias
        ? generateSmartAlias(url)
        : generateRandomSlug();

      return {
        original: url,
        processed: finalUrl,
        slug,
        domain: options.domain || DEFAULT_DOMAIN,
        utmParams: Object.keys(utmParams).length > 0 ? utmParams : undefined,
      };
    } catch (error) {
      console.error('URL processing error:', error);
      return null;
    }
  }, []);

  const generateSmartAlias = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').split('.')[0];
      const pathParts = urlObj.pathname.split('/').filter(Boolean);

      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const cleanPart = lastPart.replace(/[^a-z0-9]/gi, '').slice(0, 10);
        return generateSlugFromTitle(`${domain}-${cleanPart}`);
      }

      return generateSlugFromTitle(domain);
    } catch (error) {
      return generateRandomSlug();
    }
  };

  const generateRandomSlug = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return {
    processURL,
    generateSmartAlias,
    generateRandomSlug,
    validateURL,
  };
};
