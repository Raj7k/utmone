/**
 * MarketingShell - Minimal providers for marketing routes
 * 
 * This shell is LIGHTWEIGHT - no QueryClient, no workspace loading,
 * no heavy providers that would slow down marketing page FCP.
 * 
 * Routes using this shell:
 * - / (homepage)
 * - /pricing
 * - /features/*
 * - /solutions/*
 * - /resources/*
 * - /help/*
 * - /docs/*
 * - /tools/*
 * - /legal/*
 * - /compare/*
 * - /use-cases/*
 * - /early-access
 * - /signin, /signup
 */

import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ModalProvider } from '@/contexts/ModalContext';

interface MarketingShellProps {
  children: ReactNode;
}

export const MarketingShell = ({ children }: MarketingShellProps) => {
  return (
    <ModalProvider>
      <Toaster />
      {children}
    </ModalProvider>
  );
};
