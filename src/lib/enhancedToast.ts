import { notify } from '@/lib/notify';

interface ToastOptions {
  duration?: number;
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  notify.success(message, { duration: options?.duration || 3000 });
};

export const showErrorToast = (error: Error | string, retryFn?: () => void) => {
  const message = typeof error === 'string' ? error : error.message;
  
  notify.error(message, {
    duration: 5000,
    action: retryFn ? { label: 'retry', onClick: retryFn } : undefined,
  });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  notify.warning(message, { duration: options?.duration || 4000 });
};

interface LoadingToastUpdate {
  update: (message: string) => void;
  dismiss: () => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

export const showLoadingToast = (message: string): LoadingToastUpdate => {
  const id = notify.loading(message);

  return {
    update: (newMessage: string) => {
      notify.update(id, { title: newMessage });
    },
    dismiss: () => notify.dismiss(id),
    success: (successMessage: string) => {
      notify.dismiss(id);
      notify.success(successMessage);
    },
    error: (errorMessage: string) => {
      notify.dismiss(id);
      notify.error(errorMessage);
    },
  };
};
