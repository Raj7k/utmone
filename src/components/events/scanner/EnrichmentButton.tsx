import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

interface EnrichmentButtonProps {
  firstName: string;
  lastName: string;
  company: string;
  onEnriched: (data: { email?: string; phone?: string; linkedin?: string }) => void;
}

type EnrichmentState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Lead Enrichment Button
 * Calls enrichment API (Clay/Apollo) to find missing contact info
 */
export const EnrichmentButton = ({
  firstName,
  lastName,
  company,
  onEnriched
}: EnrichmentButtonProps) => {
  const [state, setState] = useState<EnrichmentState>('idle');

  const handleEnrich = async () => {
    if (!firstName || !company) {
      notify.error('need more info', {
        description: 'first name and company required for enrichment',
      });
      return;
    }

    setState('loading');

    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead', {
        body: {
          firstName,
          lastName,
          company
        }
      });

      if (error) throw error;

      if (data?.email || data?.phone || data?.linkedin) {
        setState('success');
        onEnriched(data);
        
        // Reset after animation
        setTimeout(() => setState('idle'), 2000);
      } else {
        throw new Error('No enrichment data found');
      }
    } catch (error) {
      console.error('Enrichment error:', error);
      setState('error');
      notify.error('enrichment failed', {
        description: 'could not find contact info',
      });
      
      // Reset after animation
      setTimeout(() => setState('idle'), 2000);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{
        scale: state === 'success' ? [1, 1.1, 1] : 1
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEnrich}
        disabled={state === 'loading'}
        className={cn(
          "gap-1 h-7 text-xs",
          state === 'success' && "text-green-500",
          state === 'error' && "text-destructive"
        )}
      >
        {state === 'idle' && (
          <>
            <Sparkles className="h-3 w-3" />
            find email
          </>
        )}
        {state === 'loading' && (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            searching...
          </>
        )}
        {state === 'success' && (
          <>
            <Check className="h-3 w-3" />
            found!
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="h-3 w-3" />
            not found
          </>
        )}
      </Button>
    </motion.div>
  );
};
