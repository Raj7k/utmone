import React, { ComponentType } from 'react';

// Import the fallback component statically to avoid circular lazy loading issues
import { ModuleLoadErrorFallback } from '@/components/ModuleLoadErrorFallback';

/**
 * Helper to clear all browser and service worker caches
 */
async function clearAllCaches(): Promise<void> {
  // Clear all browser caches
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    } catch (e) {
      console.warn('Failed to clear browser caches:', e);
    }
  }
  
  // Tell service worker to clear its cache
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage('clearCache');
  }
}

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
 * - Clears cache on final retry, then shows fallback UI instead of crashing
 * - Prevents infinite reload loops using sessionStorage
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
        
        // Final attempt failed
        if (attempt === maxRetries) {
          // Check if we've already tried reloading
          const hasReloaded = sessionStorage.getItem('moduleReloadAttempted');
          if (!hasReloaded) {
            console.warn('Module load failed after all retries, clearing cache and reloading...');
            
            // Clear all caches before redirect
            await clearAllCaches();
            
            sessionStorage.setItem('moduleReloadAttempted', 'true');
            // Use cache-busting query param
            const timestamp = Date.now();
            window.location.href = window.location.pathname + '?_t=' + timestamp;
            // Return fallback while redirecting
            return { default: ModuleLoadErrorFallback as unknown as T };
          }
          
          // Already tried reloading - show fallback UI instead of throwing
          console.error('Module load failed after reload attempt:', error);
          sessionStorage.removeItem('moduleReloadAttempted');
          return { default: ModuleLoadErrorFallback as unknown as T };
        }
        
        // Check if offline - wait for online status before retrying
        if (!navigator.onLine) {
          console.warn('Network offline, waiting for connection...');
          const isOnline = await waitForOnline(10000); // Wait up to 10s for network
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

// Clear reload flag on successful page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    sessionStorage.removeItem('moduleReloadAttempted');
  });
}
