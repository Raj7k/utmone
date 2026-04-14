import React, { ComponentType } from 'react';

// Import the fallback component statically to avoid circular lazy loading issues
import { ModuleLoadErrorFallback } from '@/components/ModuleLoadErrorFallback';

/**
 * Wait for network to come online
 */
function waitForOnline(timeout: number): Promise<boolean> {
  if (navigator.onLine) return Promise.resolve(true);
  
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onOnline);
      resolve(false);
    }, timeout);
    
    const onOnline = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', onOnline);
      resolve(true);
    };
    
    window.addEventListener('online', onOnline);
  });
}

/**
 * Wrapper for React.lazy that handles module loading failures gracefully.
 * - Retries failed imports up to 3 times with exponential backoff
 * - Checks network status before retrying
 * - Shows fallback UI instead of crashing (never reloads the page)
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  maxRetries = 3
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const backoffDelays = [500, 1000, 2000]; // Exponential backoff
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await factory();
      } catch (error: any) {
        const isModuleError = 
          error?.message?.includes('Failed to fetch dynamically imported module') ||
          error?.message?.includes('error loading dynamically imported module') ||
          error?.message?.includes('Importing a module script failed') ||
          error?.message?.includes('Loading chunk') ||
          error?.name === 'ChunkLoadError';
        
        // If not a module error, throw immediately
        if (!isModuleError) {
          throw error;
        }
        
        console.warn(`Module load attempt ${attempt + 1}/${maxRetries + 1} failed:`, error?.message);
        
        // Final attempt failed — show fallback UI, never reload
        if (attempt === maxRetries) {
          console.error('Module load failed after all retries, showing fallback UI:', error);
          return { default: ModuleLoadErrorFallback as unknown as T };
        }
        
        // Check if offline - wait for online status before retrying
        if (!navigator.onLine) {
          console.warn('Network offline, waiting for connection...');
          const isOnline = await waitForOnline(10000);
          if (!isOnline) {
            console.warn('Network still offline, showing fallback');
            return { default: ModuleLoadErrorFallback as unknown as T };
          }
        }
        
        // Wait with exponential backoff before retrying
        const delay = backoffDelays[attempt] || 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Should never reach here, but return fallback just in case
    return { default: ModuleLoadErrorFallback as unknown as T };
  });
}

// Clean up any legacy reload flags from previous versions
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    sessionStorage.removeItem('moduleReloadAttempted');
  });
}
