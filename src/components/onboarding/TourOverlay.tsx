import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTour } from "./TourContext";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

export const TourOverlay = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour } = useTour();
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  useEffect(() => {
    if (!isActive || !step) return;

    const updatePosition = () => {
      const target = document.querySelector(step.target);
      if (!target) {
        // If target not found, try again shortly
        setTimeout(updatePosition, 100);
        return;
      }

      // Auto-scroll to target element first
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });

      // Wait for scroll animation before calculating position
      setTimeout(() => {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);

        const padding = step.spotlightPadding || 8;
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const gap = 12;

        let top = 0;
        let left = 0;
        let arrowPosition: "top" | "bottom" | "left" | "right" = step.position;

        switch (step.position) {
          case "bottom":
            top = rect.bottom + gap + padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            arrowPosition = "top";
            break;
          case "top":
            top = rect.top - tooltipHeight - gap - padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            arrowPosition = "bottom";
            break;
          case "right":
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + gap + padding;
            arrowPosition = "left";
            break;
          case "left":
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - gap - padding;
            arrowPosition = "right";
            break;
        }

        // Keep tooltip in viewport
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

        setTooltipPosition({ top, left, arrowPosition });
      }, 350); // Wait for scroll animation
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isActive, step, currentStep]);

  if (!isActive || !step) return null;

  const spotlightPadding = step.spotlightPadding || 8;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
      >
        {/* Dark overlay with spotlight cutout */}
        {targetRect && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={targetRect.left - spotlightPadding}
                  y={targetRect.top - spotlightPadding}
                  width={targetRect.width + spotlightPadding * 2}
                  height={targetRect.height + spotlightPadding * 2}
                  rx="8"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.75)"
              mask="url(#spotlight-mask)"
            />
          </svg>
        )}

        {/* Spotlight border glow */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute rounded-lg pointer-events-none"
            style={{
              top: targetRect.top - spotlightPadding,
              left: targetRect.left - spotlightPadding,
              width: targetRect.width + spotlightPadding * 2,
              height: targetRect.height + spotlightPadding * 2,
              boxShadow: "0 0 0 2px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.3)",
            }}
          />
        )}

        {/* Tooltip */}
        {tooltipPosition && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            {/* Arrow */}
            <div
              className={`absolute w-3 h-3 bg-card border-border rotate-45 ${
                tooltipPosition.arrowPosition === "top"
                  ? "-top-1.5 left-1/2 -translate-x-1/2 border-l border-t"
                  : tooltipPosition.arrowPosition === "bottom"
                  ? "-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b"
                  : tooltipPosition.arrowPosition === "left"
                  ? "-left-1.5 top-1/2 -translate-y-1/2 border-l border-b"
                  : "-right-1.5 top-1/2 -translate-y-1/2 border-r border-t"
              }`}
            />

            {/* Header */}
            <div className="bg-primary/5 px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <button
                  onClick={skipTour}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                back
              </Button>

              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentStep
                        ? "bg-primary"
                        : i < currentStep
                        ? "bg-primary/40"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <Button size="sm" onClick={nextStep}>
                {currentStep === steps.length - 1 ? "finish" : "next"}
                {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
