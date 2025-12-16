import { useState, useCallback, useEffect, useRef } from 'react';
import { validateEmailSmart, ValidationResult, isEmailLikelyValid } from '@/lib/emailValidator';

interface UseSmartEmailOptions {
  debounceMs?: number;
  onValidChange?: (isValid: boolean, email: string) => void;
  allowDisposable?: boolean;
}

interface UseSmartEmailReturn {
  value: string;
  setValue: (value: string) => void;
  isValid: boolean;
  isValidating: boolean;
  error?: string;
  suggestion?: string;
  severity?: 'error' | 'warning';
  applySuggestion: () => void;
  reset: () => void;
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
}

export const useSmartEmail = (
  initialValue = '',
  options: UseSmartEmailOptions = {}
): UseSmartEmailReturn => {
  const { debounceMs = 500, onValidChange, allowDisposable } = options;
  
  const [value, setValue] = useState(initialValue);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult>({ isValid: false });
  const [hasBlurred, setHasBlurred] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidRef = useRef<boolean>(false);

  // Debounced validation
  const validate = useCallback((email: string) => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Quick pre-check - don't validate incomplete emails
    if (!isEmailLikelyValid(email)) {
      setResult({ isValid: false });
      setIsValidating(false);
      return;
    }

    setIsValidating(true);

    debounceRef.current = setTimeout(() => {
      const validationResult = validateEmailSmart(email, { allowDisposable });
      setResult(validationResult);
      setIsValidating(false);
      
      // Notify parent if validity changed
      if (validationResult.isValid !== lastValidRef.current) {
        lastValidRef.current = validationResult.isValid;
        onValidChange?.(validationResult.isValid, email);
      }
    }, debounceMs);
  }, [debounceMs, onValidChange]);

  // Run validation on value change
  useEffect(() => {
    if (value) {
      validate(value);
    } else {
      setResult({ isValid: false });
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, validate]);

  // Apply suggestion (fix typo)
  const applySuggestion = useCallback(() => {
    if (result.suggestion) {
      setValue(result.suggestion);
    }
  }, [result.suggestion]);

  // Reset state
  const reset = useCallback(() => {
    setValue('');
    setResult({ isValid: false });
    setHasBlurred(false);
  }, []);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  // Handle blur - show errors after blur
  const handleBlur = useCallback(() => {
    setHasBlurred(true);
    // Immediate validation on blur
    if (value) {
      const validationResult = validateEmailSmart(value, { allowDisposable });
      setResult(validationResult);
      setIsValidating(false);
    }
  }, [allowDisposable, value]);

  // Only show errors after user has interacted (blurred) or if there's a suggestion
  const shouldShowError = hasBlurred || result.suggestion;

  return {
    value,
    setValue,
    isValid: result.isValid,
    isValidating,
    error: shouldShowError ? result.error : undefined,
    suggestion: result.suggestion,
    severity: result.severity,
    applySuggestion,
    reset,
    inputProps: {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
  };
};
