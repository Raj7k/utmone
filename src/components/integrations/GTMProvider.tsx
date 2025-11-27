import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GTMContextType {
  pushEvent: (event: string, data?: Record<string, any>) => void;
  isLoaded: boolean;
}

const GTMContext = createContext<GTMContextType>({
  pushEvent: () => {},
  isLoaded: false,
});

export const useGTM = () => useContext(GTMContext);

interface GTMProviderProps {
  children: ReactNode;
  workspaceId?: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GTMProvider({ children, workspaceId }: GTMProviderProps) {
  const { data: gtmConfig } = useQuery({
    queryKey: ['gtm-config', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;

      const { data, error } = await supabase
        .from('workspaces')
        .select('gtm_container_id')
        .eq('id', workspaceId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (!gtmConfig?.gtm_container_id) return;

    const containerId = gtmConfig.gtm_container_id;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    
    script.onload = () => {
      // GTM loaded successfully
    };

    document.head.appendChild(script);

    // Add noscript iframe for GTM
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      // Cleanup
      script.remove();
      noscript.remove();
    };
  }, [gtmConfig?.gtm_container_id]);

  const pushEvent = (event: string, data?: Record<string, any>) => {
    if (!window.dataLayer || !gtmConfig?.gtm_container_id) {
      return;
    }

    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      ...data,
    };

    window.dataLayer.push(eventData);
  };

  const value: GTMContextType = {
    pushEvent,
    isLoaded: !!gtmConfig?.gtm_container_id,
  };

  return <GTMContext.Provider value={value}>{children}</GTMContext.Provider>;
}

// Helper hook for common events
export function useGTMEvents() {
  const { pushEvent } = useGTM();

  return {
    trackLinkClick: (linkId: string, destinationUrl: string, utmParams?: Record<string, string>) => {
      pushEvent('link_click', {
        link_id: linkId,
        destination_url: destinationUrl,
        ...utmParams,
      });
    },

    trackConversion: (linkId: string, eventType: string, eventValue?: number) => {
      pushEvent('conversion', {
        link_id: linkId,
        event_type: eventType,
        event_value: eventValue,
      });
    },

    trackPageView: (path: string) => {
      pushEvent('page_view', {
        page_path: path,
      });
    },

    trackQRGeneration: (linkId: string, variantName: string) => {
      pushEvent('qr_generated', {
        link_id: linkId,
        variant_name: variantName,
      });
    },

    trackBulkUpload: (mode: 'single' | 'bulk' | 'advanced', urlCount: number, successCount: number) => {
      pushEvent('bulk_upload_complete', {
        mode,
        url_count: urlCount,
        success_count: successCount,
        success_rate: (successCount / urlCount * 100).toFixed(1),
      });
    },

    trackBulkModeSelected: (mode: 'single' | 'bulk' | 'advanced') => {
      pushEvent('bulk_mode_selected', { mode });
    },

    trackToolOpened: (toolName: string) => {
      pushEvent('tool_opened', { tool_name: toolName });
    },
  };
}
