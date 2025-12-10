import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link2, QrCode, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";

interface WelcomeModalProps {
  userName?: string;
}

const FEATURES = [
  {
    icon: Link2,
    title: "create tracked links",
    description: "shorten URLs with built-in UTM tracking",
  },
  {
    icon: QrCode,
    title: "generate QR codes",
    description: "print-ready codes for physical campaigns",
  },
  {
    icon: BarChart3,
    title: "analyze performance",
    description: "see which channels drive results",
  },
];

export function WelcomeModal({ userName }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    const checkFirstVisit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has seen welcome modal
      const { data: profile } = await supabase
        .from("profiles")
        .select("has_seen_welcome_modal")
        .eq("id", user.id)
        .single();

      // Show modal if not seen yet
      if (profile && !profile.has_seen_welcome_modal) {
        setIsOpen(true);
      }
    };

    // Small delay to let dashboard render first
    const timer = setTimeout(checkFirstVisit, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = async () => {
    setIsOpen(false);
    
    // Mark as seen
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ has_seen_welcome_modal: true })
        .eq("id", user.id);
    }
  };

  // Auto-rotate features
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const firstName = userName?.split(" ")[0] || "there";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              welcome to utm.one, {firstName}!
            </h2>
            <p className="text-muted-foreground">
              here's what you can do
            </p>
          </div>

          {/* Feature carousel */}
          <div className="relative h-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                    {(() => {
                      const Icon = FEATURES[currentFeature].icon;
                      return <Icon className="w-6 h-6 text-foreground" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {FEATURES[currentFeature].title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {FEATURES[currentFeature].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feature indicators */}
          <div className="flex justify-center gap-1.5">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentFeature(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentFeature 
                    ? "bg-primary w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <Button onClick={handleClose} className="w-full h-12" size="lg">
            let's get started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
