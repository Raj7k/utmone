import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseArchitectStampResult {
  stampUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  generateStamp: () => Promise<void>;
}

interface UseArchitectStampParams {
  architectId: string;
  photoUrl: string;
  location: string;
  name: string;
}

export function useArchitectStamp({ architectId, photoUrl, location, name }: UseArchitectStampParams): UseArchitectStampResult {
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for cached stamp on mount
  useEffect(() => {
    const cachedStamp = localStorage.getItem(`architect-stamp-${architectId}`);
    if (cachedStamp) {
      setStampUrl(cachedStamp);
    }
  }, [architectId]);

  const generateStamp = async () => {
    if (isGenerating) return;
    
    // Allow regeneration even if stamp exists
    setIsGenerating(true);
    setError(null);

    try {
      console.log(`Generating stamp for ${name} in ${location}`);
      
      const { data, error: fnError } = await supabase.functions.invoke('generate-architect-stamp', {
        body: { 
          photoUrl, 
          location,
          name
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.stampUrl) {
        setStampUrl(data.stampUrl);
        // Cache in localStorage
        localStorage.setItem(`architect-stamp-${architectId}`, data.stampUrl);
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
