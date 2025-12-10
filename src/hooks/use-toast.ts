/**
 * Backward-compatible toast API
 * Redirects all toast calls to the new Apple HIG notification system
 */
import { notify } from "@/lib/notify";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

// Legacy toast function - redirects to new notify system
export function toast(props: ToastProps) {
  const title = props.title || props.description || "";
  const description = props.title ? props.description : undefined;
  
  if (props.variant === "destructive") {
    return notify.error(title, { description });
  }
  return notify.success(title, { description });
}

// Legacy useToast hook - returns toast function and empty state
export function useToast() {
  return {
    toast,
    toasts: [] as any[],
    dismiss: notify.dismiss,
  };
}
