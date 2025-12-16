import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSmartEmail } from '@/hooks/useSmartEmail';

interface SmartEmailInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidChange?: (isValid: boolean, email: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  allowDisposable?: boolean;
}

export const SmartEmailInput = forwardRef<HTMLInputElement, SmartEmailInputProps>(
  ({ 
    value: externalValue,
    onChange,
    onValidChange,
    placeholder = "you@company.com",
    className,
    disabled,
    id,
    name,
    required,
    autoComplete = "email",
    allowDisposable,
  }, ref) => {
    const {
      value,
      setValue,
      isValid,
      isValidating,
      error,
      suggestion,
      severity,
      applySuggestion,
      inputProps,
    } = useSmartEmail(externalValue || '', { onValidChange, allowDisposable });

    // Sync with external value
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      inputProps.onChange(e);
      onChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="email"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={inputProps.onBlur}
          placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      className={cn(
        "pr-10",
        error && severity === 'error'
          ? "border-red-500 focus-visible:ring-red-500/20"
          : error && severity === 'warning'
            ? "border-amber-500 focus-visible:ring-amber-500/20"
            : isValid
              ? "border-green-500 focus-visible:ring-green-500/20"
              : "",
        className
      )}
    />
        
        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isValid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : error ? (
            <AlertCircle className={cn(
              "h-4 w-4",
              severity === 'error' ? "text-red-500" : "text-amber-500"
            )} />
          ) : null}
        </div>

        {/* Error/Suggestion Message */}
        {error && (
          <div className={cn(
            "mt-1.5 text-xs",
            severity === 'error' ? "text-red-500" : "text-amber-600 dark:text-amber-400"
          )}>
            {suggestion ? (
              <button
                type="button"
                onClick={applySuggestion}
                className="hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                {error}
                <span className="font-medium">click to fix</span>
              </button>
            ) : (
              <span>{error}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

SmartEmailInput.displayName = 'SmartEmailInput';
