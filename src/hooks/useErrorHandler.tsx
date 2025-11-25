import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

interface ErrorContext {
  type: ErrorType;
  message: string;
  code?: string;
  details?: string;
  canRetry: boolean;
}

export const classifyError = (error: any): ErrorContext => {
  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Connection issue. Please check your internet.',
      canRetry: true
    };
  }

  // Auth errors
  if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('auth')) {
    return {
      type: ErrorType.AUTH,
      message: 'Session expired. Please log in again.',
      code: error.code,
      canRetry: false
    };
  }

  // Validation errors
  if (error.code?.startsWith('23') || error.code === 'PGRST116') {
    const validationMessages: Record<string, string> = {
      '23505': 'This item already exists.',
      '23503': 'Cannot complete due to related items.',
      'PGRST116': 'Item not found.'
    };
    return {
      type: ErrorType.VALIDATION,
      message: validationMessages[error.code] || 'Invalid input.',
      code: error.code,
      details: error.details || error.hint,
      canRetry: false
    };
  }

  // Server errors
  if (error.code?.startsWith('5') || error.status >= 500) {
    return {
      type: ErrorType.SERVER,
      message: 'Server issue. Please try again.',
      code: error.code,
      canRetry: true
    };
  }

  // Unknown errors
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'An unexpected error occurred.',
    canRetry: true
  };
};

export const useErrorHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleError = useCallback((error: any, context?: { action?: string; userId?: string }) => {
    const errorContext = classifyError(error);

    // Log error to admin audit logs for server/auth errors
    if (errorContext.type === ErrorType.SERVER || errorContext.type === ErrorType.AUTH) {
      supabase.rpc('log_security_event', {
        p_event_type: `error_${errorContext.type}`,
        p_user_id: context?.userId || null,
        p_metadata: {
          message: errorContext.message,
          code: errorContext.code,
          details: errorContext.details,
          action: context?.action,
          timestamp: new Date().toISOString()
        }
      }).then(({ error: logError }) => {
        if (logError) {
          console.error('Failed to log error:', logError);
        }
      });
    }

    // Show user-friendly toast
    toast({
      title: 'Error',
      description: errorContext.message,
      variant: 'destructive'
    });

    console.error('[Error Handler]', {
      type: errorContext.type,
      message: errorContext.message,
      code: errorContext.code,
      details: errorContext.details,
      originalError: error
    });

    return errorContext;
  }, []);

  const withRetry = useCallback(async <T,>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> => {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const errorContext = classifyError(error);

        if (!errorContext.canRetry) {
          throw error;
        }

        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError;
  }, []);

  return {
    handleError,
    withRetry,
    isOnline
  };
};
