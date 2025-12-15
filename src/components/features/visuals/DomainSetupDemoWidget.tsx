import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, Lock, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Enter Domain", icon: Globe },
  { id: 2, label: "Verify DNS", icon: Check },
  { id: 3, label: "SSL Ready", icon: Lock },
];

export const DomainSetupDemoWidget = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDomainSubmit = () => {
    if (!domain) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentStep(2);
      setTimeout(() => setCurrentStep(3), 1500);
    }, 1200);
  };

  const reset = () => {
    setCurrentStep(1);
    setDomain("");
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Glass container */}
      <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }} />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-white/90">Custom Domain Setup</span>
          </div>
          {currentStep === 3 && (
            <button 
              onClick={reset}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Reset Demo
            </button>
          )}
        </div>

        {/* Steps indicator */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  currentStep >= step.id ? "opacity-100" : "opacity-40"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    currentStep > step.id 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : currentStep === step.id 
                        ? "bg-primary/20 text-primary" 
                        : "bg-white/10 text-white/40"
                  )}>
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs text-white/60 hidden sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className={cn(
                    "w-4 h-4 mx-4 transition-colors duration-300",
                    currentStep > step.id ? "text-emerald-400" : "text-white/20"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="go.yourcompany.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                <button
                  onClick={handleDomainSubmit}
                  disabled={!domain || isVerifying}
                  className={cn(
                    "w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                    domain 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  )}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying DNS...
                    </>
                  ) : (
                    "Verify Domain"
                  )}
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <p className="text-white/80">Provisioning SSL certificate...</p>
                <p className="text-sm text-white/40">This usually takes seconds</p>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"
                >
                  <Check className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <div>
                  <p className="text-white font-medium">Domain Active!</p>
                  <p className="text-sm text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
                    <Lock className="w-3 h-3" />
                    https://{domain || "go.yourcompany.com"}
                  </p>
                </div>
                <p className="text-xs text-white/40">SSL auto-provisioned via Let's Encrypt</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};