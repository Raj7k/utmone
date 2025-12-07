import React, { ComponentType } from 'react';

/**
 * Wrapper for React.lazy that handles module loading failures gracefully.
 * Retries failed imports once, then forces a page reload if necessary.
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
              console.warn('Module load failed, reloading page...', error);
              sessionStorage.setItem('moduleReloadAttempted', 'true');
              window.location.reload();
              // Return a placeholder while reloading
              return { default: (() => null) as unknown as T };
            }
            // Clear the flag so future navigations can retry
            sessionStorage.removeItem('moduleReloadAttempted');
          }
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
      }
    }
    throw new Error('Failed to load module after retries');
  });
}

// Clear reload flag on successful page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    sessionStorage.removeItem('moduleReloadAttempted');
  });
}
