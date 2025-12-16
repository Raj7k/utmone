import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X, Check, AlertCircle } from "lucide-react";
import { captureEmailLead } from "@/lib/captureEmailLead";
import { useModal } from "@/contexts/ModalContext";
import { validateEmailSmart, ValidationResult } from "@/lib/emailValidator";

interface FullScreenEmailCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FullScreenEmailCapture = ({
  open,
  onOpenChange,
}: FullScreenEmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openEarlyAccessModal } = useModal();

  // Validate on change with debounce
  useEffect(() => {
    if (!email) {
      setValidation(null);
      return;
    }
    const timeout = setTimeout(() => {
      setValidation(validateEmailSmart(email, { allowDisposable: true }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateEmailSmart(email, { allowDisposable: true });
    if (!result.isValid && result.reason !== "disposable") {
      setValidation(result);
      return;
    }

    setIsSubmitting(true);

    const normalizedEmail = result.normalizedEmail || email.trim().toLowerCase();

    // Capture email immediately
    await captureEmailLead({
      email: normalizedEmail,
      source: "fullscreen_capture",
      referralCode: new URLSearchParams(window.location.search).get("ref"),
      metadata: {
        email_quality_reason: result.reason,
        email_suggestion_shown: !!result.suggestion,
        is_disposable: result.reason === "disposable",
      },
    });

    // Close this overlay and open the step form modal
    onOpenChange(false);
    openEarlyAccessModal(email);
    
    // Reset state
    setEmail("");
    setValidation(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
    setValidation(null);
  };

  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10 w-full max-w-md px-6"
          >
            <div className="text-center space-y-6">
              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  join the early circle
                </h2>
                <p className="text-lg text-muted-foreground">
                  enter your email to get started
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-14 text-lg bg-card border-border rounded-xl text-center placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12 ${
                      validation?.reason === "disposable" ? 'border-amber-500' :
                      validation?.isValid ? 'border-green-500' :
                      validation?.error && validation.severity === 'error' ? 'border-red-500' :
                      validation?.error && validation.severity === 'warning' ? 'border-amber-500' : ''
                    }`}
                    autoFocus
                    required
                  />
                  {/* Status icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {validation?.reason === "disposable" ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : validation?.isValid ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : null}
                    {validation?.error && !validation.isValid && (
                      <AlertCircle className={`h-5 w-5 ${validation.severity === 'error' ? 'text-red-500' : 'text-amber-500'}`} />
                    )}
                  </div>
                  {validation?.error && (
                    <div className="absolute -bottom-7 left-0 right-0 text-center">
                      {validation.suggestion ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(validation.suggestion!);
                            setValidation(validateEmailSmart(validation.suggestion!, { allowDisposable: true }));
                          }}
                          className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          {validation.error} <span className="font-medium">click to fix</span>
                        </button>
                      ) : (
                        <p className={`text-sm ${validation.severity === "warning" ? "text-amber-600 dark:text-amber-400" : "text-destructive"}`}>{validation.error}</p>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg rounded-xl font-medium"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      continue
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Trust Badge */}
              <p className="text-sm text-muted-foreground">
                no credit card required • free forever for early adopters
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
