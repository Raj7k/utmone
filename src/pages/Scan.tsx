import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, ArrowLeft, Wifi, WifiOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { TapToScanScanner } from "@/components/events/scanner/TapToScanScanner";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

/**
 * Standalone PWA Scanner Page
 * Direct entry point at /scan for quick access via home screen widget
 */
const ScanPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">One-Tap</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-yellow-500" />
          )}
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Scanner Content */}
      <main className="flex-1 p-4">
        <TapToScanScanner 
          eventId="quick-scan"
          eventName="Quick Scan"
          onScanComplete={() => {
            // Optional: navigate somewhere or show toast
          }}
        />
      </main>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default ScanPage;
