/**
 * AuthShell - Lightweight shell for auth pages
 * 
 * Provides only QueryClientProvider (for feature flags) + essentials.
 * NO workspace loading, NO session context - keeps auth pages fast.
 * 
 * Routes using this shell:
 * - /auth
 * - /signup
 * - /mc (AdminAuth)
 * - /reset-password
 * - /auth/callback
 * - /waitlist-pending
 * - /waitlist-status
 * - /waitlist-locked
 */

import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryConfig';
import { Toaster } from '@/components/ui/sonner';
import { ModalProvider } from '@/contexts/ModalContext';

interface AuthShellProps {
  children: ReactNode;
}

export const AuthShell = ({ children }: AuthShellProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Toaster />
        {children}
      </ModalProvider>
    </QueryClientProvider>
  );
};
