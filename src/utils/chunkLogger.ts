import { ComponentType, lazy } from "react";

/**
 * Wrap React.lazy with dev-time chunk logging so we can see which route
 * pulls which bundles while iterating locally.
 */
export function lazyWithChunkLogging<T extends ComponentType<any>>(label: string, loader: () => Promise<{ default: T }>) {
  return lazy(async () => {
    const start = typeof performance !== "undefined" ? performance.now() : Date.now();
    const mod = await loader();

    if (import.meta.env.DEV && typeof window !== "undefined") {
      const duration = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - start);
      const route = window.location?.pathname ?? "unknown";
      console.info(`[chunk-trace] ${label} loaded on ${route} in ${duration}ms`);
    }

    return mod;
  });
}

/**
 * Lightweight helper to log manual chunk boundaries when dynamic imports
 * are triggered outside of React.lazy.
 */
export async function logChunkLoad<T>(label: string, loader: () => Promise<T>) {
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();
  const mod = await loader();

  if (import.meta.env.DEV && typeof window !== "undefined") {
    const duration = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - start);
    const route = window.location?.pathname ?? "unknown";
    console.info(`[chunk-trace] ${label} loaded on ${route} in ${duration}ms`);
  }

  return mod;
}
