/**
 * PublicPageShell - Lightweight shell for public pages that need minimal data fetching
 * 
 * Used for:
 * - /u/:slug (public link pages)
 * 
 * This shell provides a minimal QueryClient for single-page queries
 * WITHOUT loading any dashboard code, workspace providers, or auth.
 */

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Lightweight query client - minimal defaults
const publicQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

interface PublicPageShellProps {
  children: ReactNode;
}

export const PublicPageShell = ({ children }: PublicPageShellProps) => {
  return (
    <QueryClientProvider client={publicQueryClient}>
      <Toaster />
      {children}
    </QueryClientProvider>
  );
};
