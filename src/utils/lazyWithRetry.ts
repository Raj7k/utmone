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
 * Wrapper for React.lazy that handles module loading failures gracefully.
 * Retries failed imports once, clears cache, then shows a fallback UI instead of crashing.
 * Prevents infinite reload loops using sessionStorage.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 1
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await factory();
      } catch (error: any) {
        const isModuleError = error?.message?.includes('Failed to fetch dynamically imported module') ||
                             error?.message?.includes('error loading dynamically imported module') ||
                             error?.message?.includes('Importing a module script failed');
        
        if (i === retries) {
          if (isModuleError) {
            // Check if we've already tried reloading
            const hasReloaded = sessionStorage.getItem('moduleReloadAttempted');
            if (!hasReloaded) {
              console.warn('Module load failed, clearing cache and reloading...', error);
              
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
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
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
