import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { skipWaiting } from "@/lib/serviceWorker";

export const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handler = (event: CustomEvent<ServiceWorkerRegistration>) => {
      setUpdateAvailable(true);
      setRegistration(event.detail);
    };

    window.addEventListener('sw-update', handler as EventListener);
    return () => window.removeEventListener('sw-update', handler as EventListener);
  }, []);

  const handleUpdate = () => {
    if (registration) {
      skipWaiting(registration);
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm mb-1">
                update available
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                a new version is ready to install
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleUpdate}
                  className="gap-2 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  refresh
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs"
                >
                  later
                </Button>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
