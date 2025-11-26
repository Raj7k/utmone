import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LinkPreview {
  url: string;
  favicon_url: string | null;
  page_title: string | null;
  og_image_url: string | null;
  is_ssl_secure: boolean | null;
  is_safe: boolean | null;
  threats: any | null;
  isLoading: boolean;
}

export const useBulkLinkPreview = (urls: string[]) => {
  const [previews, setPreviews] = useState<Map<string, LinkPreview>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urls.length === 0) {
      setPreviews(new Map());
      return;
    }

    const fetchPreviews = async () => {
      setIsLoading(true);
      const previewMap = new Map<string, LinkPreview>();

      // Initialize with loading state
      urls.forEach(url => {
        previewMap.set(url, {
          url,
          favicon_url: null,
          page_title: null,
          og_image_url: null,
          is_ssl_secure: null,
          is_safe: null,
          threats: null,
          isLoading: true,
        });
      });
      setPreviews(new Map(previewMap));

      // Fetch previews in parallel (limit to 5 concurrent requests)
      const batchSize = 5;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (url) => {
            try {
              const { data, error } = await supabase.functions.invoke('fetch-link-preview', {
                body: { destinationUrl: url, linkId: null },
              });

              if (!error && data) {
                previewMap.set(url, {
                  url,
                  favicon_url: data.favicon_url,
                  page_title: data.page_title,
                  og_image_url: data.og_image_url,
                  is_ssl_secure: data.is_ssl_secure,
                  is_safe: data.is_safe,
                  threats: data.threats,
                  isLoading: false,
                });
              } else {
                previewMap.set(url, {
                  url,
                  favicon_url: null,
                  page_title: null,
                  og_image_url: null,
                  is_ssl_secure: url.startsWith('https://'),
                  is_safe: null,
                  threats: null,
                  isLoading: false,
                });
              }
            } catch (err) {
              previewMap.set(url, {
                url,
                favicon_url: null,
                page_title: null,
                og_image_url: null,
                is_ssl_secure: url.startsWith('https://'),
                is_safe: null,
                threats: null,
                isLoading: false,
              });
            }
          })
        );

        // Update state after each batch
        setPreviews(new Map(previewMap));
      }

      setIsLoading(false);
    };

    fetchPreviews();
  }, [urls.join(',')]); // Only re-fetch when URLs change

  return { previews, isLoading };
};
