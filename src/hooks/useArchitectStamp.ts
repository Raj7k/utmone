import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseArchitectStampResult {
  stampUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  generateStamp: () => Promise<void>;
}

export function useArchitectStamp(architectId: string, originalPhoto: string): UseArchitectStampResult {
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for cached stamp on mount
  useEffect(() => {
    const checkCachedStamp = async () => {
      try {
        const { data } = supabase.storage
          .from('architect-stamps')
          .getPublicUrl(`stamps/${architectId}.png`);

        // Try to fetch the image to verify it exists
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          setStampUrl(data.publicUrl);
        }
      } catch (err) {
        // Stamp doesn't exist yet, that's fine
        console.log(`No cached stamp for ${architectId}`);
      }
    };

    checkCachedStamp();
  }, [architectId]);

  const generateStamp = async () => {
    if (isGenerating || stampUrl) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-architect-stamp', {
        body: { architectId, photoUrl: originalPhoto }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.stampUrl) {
        setStampUrl(data.stampUrl);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate stamp';
      setError(message);
      console.error('Stamp generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { stampUrl, isGenerating, error, generateStamp };
}
