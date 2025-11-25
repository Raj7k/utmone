import { toast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

export const handleSupabaseError = (error: PostgrestError | Error): AppError => {
  console.error("Supabase error:", error);

  if ("code" in error) {
    // PostgrestError
    const postgrestError = error as PostgrestError;

    // Common error code mappings
    const errorMap: Record<string, string> = {
      "23505": "this item already exists",
      "23503": "this action cannot be completed due to related items",
      "42P01": "database table not found",
      "42501": "you don't have permission to perform this action",
      PGRST116: "row not found",
      "08006": "connection failed",
    };

    const message = errorMap[postgrestError.code] || postgrestError.message;

    return {
      message,
      code: postgrestError.code,
      details: postgrestError.details || postgrestError.hint,
    };
  }

  // Generic Error
  return {
    message: error.message || "an unexpected error occurred",
  };
};

export const showErrorToast = (error: AppError | Error | string) => {
  const appError = typeof error === "string" 
    ? { message: error } 
    : "message" in error && "code" in error
    ? error
    : handleSupabaseError(error as Error);

  toast({
    title: "error",
    description: appError.message,
    variant: "destructive",
  });
};

export const showSuccessToast = (message: string, description?: string) => {
  toast({
    title: message,
    description,
  });
};

// Network error detection
export const isNetworkError = (error: Error): boolean => {
  return (
    error.message.includes("network") ||
    error.message.includes("fetch") ||
    error.message.includes("connection")
  );
};

// Retry logic for failed requests
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1 && isNetworkError(lastError)) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      } else {
        throw lastError;
      }
    }
  }

  throw lastError!;
};
