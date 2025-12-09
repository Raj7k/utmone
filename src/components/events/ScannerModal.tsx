import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  QrCode, 
  Check, 
  AlertTriangle, 
  RefreshCw,
  X,
  ImageIcon,
  Keyboard
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseBadgeData, splitFullName } from "./scanner/parseBadgeData";
import { cn } from "@/lib/utils";

interface ScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  onScanComplete?: () => void;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'processing' | 'manual';

export const ScannerModal = ({ 
  open, 
  onOpenChange, 
  eventId, 
  eventName,
  onScanComplete 
}: ScannerModalProps) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    title: '',
  });
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize scanner (called after container is rendered)
  const initializeScanner = useCallback(async () => {
    if (!containerRef.current || scannerRef.current) return;
    
    try {
      const scanner = new Html5Qrcode("scanner-container");
      scannerRef.current = scanner;
      
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Vibrate on success
          if ('vibrate' in navigator) {
            navigator.vibrate(200);
          }
          
          const parsed = parseBadgeData(decodedText);
          
          let firstName = parsed.firstName || '';
          let lastName = parsed.lastName || '';
          
          if (!firstName && parsed.fullName) {
            const split = splitFullName(parsed.fullName);
            firstName = split.firstName;
            lastName = split.lastName;
          }
          
          setEditedData({
            firstName,
            lastName,
            email: parsed.email || '',
            company: parsed.company || '',
            title: parsed.title || '',
          });
          
          setStatus('success');
          
          // Stop scanner after successful scan
          scanner.stop().catch(console.error);
        },
        () => {
          // Ignore scan errors (no QR found)
        }
      );
    } catch (error: any) {
      console.error('Scanner error:', error);
      setCameraError(error?.message || 'Could not access camera');
      setStatus('idle');
    }
  }, []);

  // Start scanner - just set status, useEffect will initialize
  const startScanner = useCallback(() => {
    setCameraError(null);
    setStatus('scanning');
  }, []);

  // Initialize scanner when status changes to scanning and container is ready
  useEffect(() => {
    if (status === 'scanning' && containerRef.current && !scannerRef.current) {
      // Small delay to ensure DOM is fully painted
      const timer = setTimeout(() => {
        initializeScanner();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [status, initializeScanner]);

  // Stop scanner
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
      scannerRef.current = null;
    }
  }, []);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      stopScanner();
      setStatus('idle');
      setCameraError(null);
      setEditedData({ firstName: '', lastName: '', email: '', company: '', title: '' });
    }
  }, [open, stopScanner]);

  // Capture OCR
  const captureOCR = async () => {
    if (!scannerRef.current) return;
    
    setStatus('processing');
    
    try {
      // Get video element
      const videoElement = document.querySelector('#scanner-container video') as HTMLVideoElement;
      if (!videoElement) throw new Error('Camera not available');
      
      // Capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoElement, 0, 0);
      
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
      
      // Send to OCR
      const { data, error } = await supabase.functions.invoke('scan-badge-ocr', {
        body: { imageBase64 }
      });
      
      if (error) throw error;
      
      if (data && (data.email || data.firstName || data.company)) {
        setEditedData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          company: data.company || '',
          title: data.title || '',
        });
        setStatus('success');
        await stopScanner();
        toast({ title: 'badge text extracted' });
      } else {
        throw new Error('Could not extract text');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: 'ocr failed',
        description: 'try manual entry instead',
        variant: 'destructive'
      });
      setStatus('scanning');
    }
  };

  // Save lead
  const saveLead = async () => {
    if (!editedData.email && !editedData.firstName) {
      toast({
        title: 'missing info',
        description: 'provide at least email or name',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const { error } = await supabase.from('event_badge_scans').insert({
        event_id: eventId,
        email: editedData.email || `unknown-${Date.now()}@scan.local`,
        first_name: editedData.firstName || null,
        last_name: editedData.lastName || null,
        company: editedData.company || null,
        title: editedData.title || null,
        scanned_at: new Date().toISOString(),
      });
      
      if (error) throw error;
      
      toast({ title: 'lead saved' });
      onScanComplete?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'save failed',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="font-display font-semibold text-foreground">
            scan badge
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{eventName}</p>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          {/* Scanner or Form */}
          {status === 'idle' && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
                  <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive">{cameraError}</p>
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={startScanner} className="gap-2">
                  <QrCode className="h-4 w-4" />
                  start scanner
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStatus('manual')}
                  className="gap-2"
                >
                  <Keyboard className="h-4 w-4" />
                  manual entry
                </Button>
              </div>
            </div>
          )}
          
          {/* Scanner container - always in DOM, hidden when not scanning */}
          <div className={cn("space-y-3", status !== 'scanning' && "hidden")}>
            <div 
              ref={containerRef}
              id="scanner-container" 
              className="relative rounded-lg overflow-hidden bg-black aspect-video"
            />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={captureOCR}
                className="flex-1 gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                capture text (ocr)
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  stopScanner();
                  setStatus('manual');
                }}
              >
                manual entry
              </Button>
            </div>
          </div>
          
          {status === 'processing' && (
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">reading badge...</p>
              </div>
            </div>
          )}
          
          {(status === 'success' || status === 'manual') && (
            <div className="space-y-4">
              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-emerald-600">badge scanned successfully</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">first name</Label>
                  <Input
                    value={editedData.firstName}
                    onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">last name</Label>
                  <Input
                    value={editedData.lastName}
                    onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">email</Label>
                <Input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@company.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">company</Label>
                  <Input
                    value={editedData.company}
                    onChange={(e) => setEditedData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Acme Inc"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">title</Label>
                  <Input
                    value={editedData.title}
                    onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Director"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button onClick={saveLead} className="flex-1">
                  save lead
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatus('idle');
                    setEditedData({ firstName: '', lastName: '', email: '', company: '', title: '' });
                  }}
                >
                  scan another
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
