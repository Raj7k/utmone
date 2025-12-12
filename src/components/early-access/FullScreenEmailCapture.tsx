import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X } from "lucide-react";
import { z } from "zod";
import { captureEmailLead } from "@/lib/captureEmailLead";
import { useModal } from "@/contexts/ModalContext";

const emailSchema = z.string().email();

interface FullScreenEmailCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FullScreenEmailCapture = ({
  open,
  onOpenChange,
}: FullScreenEmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openEarlyAccessModal } = useModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError("please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    // Capture email immediately
    await captureEmailLead({
      email,
      source: "fullscreen_capture",
      referralCode: new URLSearchParams(window.location.search).get("ref"),
    });

    // Close this overlay and open the step form modal
    onOpenChange(false);
    openEarlyAccessModal(email);
    
    // Reset state
    setEmail("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
    setEmailError("");
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
                    className="h-14 text-lg bg-card border-border rounded-xl text-center placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    autoFocus
                    required
                  />
                  {emailError && (
                    <p className="absolute -bottom-6 left-0 right-0 text-sm text-destructive text-center">
                      {emailError}
                    </p>
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
