/// <reference types="vite/client" />

// Global window augmentation for cached auth
declare global {
  interface Window {
    __CACHED_USER__?: { id: string; email?: string };
    __AUTH_READY__?: boolean;
    __hideInstantSkeleton?: () => void;
  }
}

export {};
