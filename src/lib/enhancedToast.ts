import { toast } from '@/hooks/use-toast';

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast({
    title: 'Success',
    description: message,
    duration: options?.duration || 3000,
    action: options?.action,
  });
};

export const showErrorToast = (error: Error | string, retryFn?: () => void) => {
  const message = typeof error === 'string' ? error : error.message;
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
    duration: 5000,
    action: retryFn ? {
      label: 'Retry',
      onClick: retryFn,
    } : undefined,
  });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast({
    title: 'Warning',
    description: message,
    duration: options?.duration || 4000,
    action: options?.action,
  });
};

interface LoadingToastUpdate {
  update: (message: string) => void;
  dismiss: () => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

export const showLoadingToast = (message: string): LoadingToastUpdate => {
  const { id, dismiss, update } = toast({
    title: 'Loading',
    description: message,
    duration: Infinity,
  });

  return {
    update: (newMessage: string) => {
      update({
        id,
        title: 'Loading',
        description: newMessage,
      });
    },
    dismiss: () => dismiss(),
    success: (successMessage: string) => {
      update({
        id,
        title: 'Success',
        description: successMessage,
        duration: 3000,
      });
    },
    error: (errorMessage: string) => {
      update({
        id,
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    },
  };
};
