import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  Check, 
  AlertTriangle, 
  RefreshCw,
  X,
  Sparkles,
  Zap,
  Camera
} from "lucide-react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseBadgeData, ParsedBadgeData, splitFullName } from "./parseBadgeData";
import { useOfflineScans } from "./useOfflineScans";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { SyncStatusBar } from "./SyncStatusBar";
import { TorchToggle } from "./TorchToggle";
import { LowConfidenceField } from "./LowConfidenceField";
import { EnrichmentButton } from "./EnrichmentButton";
import { cn } from "@/lib/utils";

interface TapToScanScannerProps {
  eventId: string;
  eventName: string;
  onScanComplete?: () => void;
}

type ScannerState = 'idle' | 'scanning' | 'processing' | 'captured' | 'enriching';

interface FieldConfidence {
  firstName: number;
  lastName: number;
  email: number;
  company: number;
  title: number;
}

/**
 * Tap-to-Scan Scanner - Battery-Saver Mode
 * Camera only opens when user taps, auto-closes after scan
 */
export const TapToScanScanner = ({ eventId, eventName, onScanComplete }: TapToScanScannerProps) => {
  const [state, setState] = useState<ScannerState>('idle');
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    title: '',
    notes: ''
  });
  const [fieldConfidence, setFieldConfidence] = useState<FieldConfidence>({
    firstName: 100,
    lastName: 100,
    email: 100,
    company: 100,
    title: 100
  });
  const [overallConfidence, setOverallConfidence] = useState(100);
  const [enrichmentNeeded, setEnrichmentNeeded] = useState(false);
  const [badgeType, setBadgeType] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { 
    scans, 
    pendingCount, 
    isSyncing, 
    isOnline, 
    addScan, 
    syncScans,
    getScansNeedingReview,
    validateFieldConfidence
  } = useOfflineScans(eventId);

  const syncedCount = scans.filter(s => s.synced).length;
  const reviewCount = getScansNeedingReview().length;

  // Start camera when entering scanning state
  const startCamera = useCallback(async () => {
    setState('scanning');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      
      // Initialize QR scanner
      const scannerId = "tap-scan-reader";
      const container = document.getElementById(scannerId);
      
      if (container && !scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          scannerId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            rememberLastUsedCamera: true,
          },
          false
        );

        scannerRef.current.render(
          (decodedText) => handleQRSuccess(decodedText),
          (errorMessage) => {
            // Silent errors during scanning
          }
        );
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: 'camera access denied',
        description: 'please enable camera permissions',
        variant: 'destructive'
      });
      setState('idle');
    }
  }, []);

  // Stop camera and cleanup
  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Handle successful QR scan
  const handleQRSuccess = useCallback((decodedText: string) => {
    // Vibrate on success
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }

    const parsed = parseBadgeData(decodedText);

    if (parsed.parseMethod === 'encrypted' || parsed.confidence < 30) {
      // Need OCR for encrypted badges
      captureAndOCR();
    } else {
      stopCamera();
      populateEditedData(parsed);
      setState('captured');
    }
  }, [stopCamera]);

  // Capture image and run OCR
  const captureAndOCR = async () => {
    setState('processing');

    try {
      const videoElement = document.querySelector('#tap-scan-reader video') as HTMLVideoElement;
      
      if (!videoElement) {
        throw new Error('Camera not available');
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoElement, 0, 0);
      
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);

      const { data, error } = await supabase.functions.invoke('scan-badge-ocr', {
        body: { imageBase64 }
      });

      if (error) throw error;

      stopCamera();

      if (data && (data.email || data.firstName || data.company)) {
        const ocrConfidence = data.confidence || 70;
        
        setEditedData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          company: data.company || '',
          title: data.title || '',
          notes: ''
        });
        
        // Set field confidence from OCR
        const fieldConf = data.fieldConfidence || {};
        setFieldConfidence({
          firstName: fieldConf.firstName || ocrConfidence,
          lastName: fieldConf.lastName || ocrConfidence,
          email: fieldConf.email || ocrConfidence,
          company: fieldConf.company || ocrConfidence,
          title: fieldConf.title || ocrConfidence
        });
        
        setOverallConfidence(ocrConfidence);
        setBadgeType(data.badgeType || null);
        setEnrichmentNeeded(!data.email);
        setState('captured');
        
        toast({
          title: 'badge captured',
          description: `confidence: ${ocrConfidence}%`
        });
      } else {
        throw new Error('Could not read badge');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: 'scan failed',
        description: 'tap to try again',
        variant: 'destructive'
      });
      setState('idle');
    }
  };

  // Populate form with parsed data
  const populateEditedData = (data: ParsedBadgeData) => {
    let firstName = data.firstName || '';
    let lastName = data.lastName || '';
    
    if (!firstName && data.fullName) {
      const split = splitFullName(data.fullName);
      firstName = split.firstName;
      lastName = split.lastName;
    }

    setEditedData({
      firstName,
      lastName,
      email: data.email || '',
      company: data.company || '',
      title: data.title || '',
      notes: ''
    });
    
    setOverallConfidence(data.confidence || 80);
    setEnrichmentNeeded(!data.email);
  };

  // Save lead
  const saveLead = () => {
    if (!editedData.email && !editedData.firstName) {
      toast({
        title: 'missing info',
        description: 'please provide at least an email or name',
        variant: 'destructive'
      });
      return;
    }

    addScan({
      eventId,
      email: editedData.email,
      firstName: editedData.firstName,
      lastName: editedData.lastName,
      company: editedData.company,
      title: editedData.title,
      notes: editedData.notes
    }, overallConfidence);

    toast({
      title: 'lead saved',
      description: isOnline ? 'synced to cloud' : 'saved offline'
    });

    // Reset to idle
    resetScanner();
    onScanComplete?.();
  };

  // Reset scanner to idle state
  const resetScanner = () => {
    setState('idle');
    setEditedData({ firstName: '', lastName: '', email: '', company: '', title: '', notes: '' });
    setFieldConfidence({ firstName: 100, lastName: 100, email: 100, company: 100, title: 100 });
    setOverallConfidence(100);
    setEnrichmentNeeded(false);
    setBadgeType(null);
  };

  // Handle enrichment complete
  const handleEnrichmentComplete = (enrichedData: { email?: string; phone?: string; linkedin?: string }) => {
    if (enrichedData.email) {
      setEditedData(prev => ({ ...prev, email: enrichedData.email || '' }));
      setEnrichmentNeeded(false);
      toast({
        title: 'lead enriched',
        description: 'contact info found!'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Sync Status */}
      <SyncStatusBar
        isOnline={isOnline}
        pendingCount={pendingCount}
        syncedCount={syncedCount}
        isSyncing={isSyncing}
        reviewCount={reviewCount}
        onSync={syncScans}
      />

      {/* Main Scanner Area */}
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card 
              className="relative overflow-hidden cursor-pointer group"
              onClick={startCamera}
            >
              <div className="aspect-[4/3] bg-black flex flex-col items-center justify-center">
                {/* Glowing scan button */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-primary text-primary-foreground rounded-full p-8">
                    <Scan className="h-12 w-12" />
                  </div>
                </motion.div>
                
                <p className="mt-6 text-white text-lg font-medium">
                  tap to scan badge
                </p>
                <p className="text-white/60 text-sm mt-1">
                  camera opens only when needed
                </p>
                
                {/* Battery saver indicator */}
                <Badge 
                  variant="outline" 
                  className="mt-4 border-green-500/50 text-green-400 gap-1"
                >
                  <Zap className="h-3 w-3" />
                  battery saver mode
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}

        {state === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <TorchToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => {
                    stopCamera();
                    setState('idle');
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div 
                id="tap-scan-reader" 
                className="w-full"
                style={{ minHeight: '300px' }}
              />
              
              {/* Capture button for OCR fallback */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button
                  onClick={captureAndOCR}
                  className="gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                >
                  <Camera className="h-4 w-4" />
                  capture badge (ai ocr)
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {state === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="aspect-[4/3] bg-black flex flex-col items-center justify-center">
              <RefreshCw className="h-12 w-12 text-white animate-spin mb-4" />
              <p className="text-white text-lg">reading badge...</p>
              <p className="text-white/60 text-sm mt-1">ai extracting contact info</p>
            </Card>
          </motion.div>
        )}

        {state === 'captured' && (
          <motion.div
            key="captured"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 space-y-4">
              {/* Success Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-foreground">lead captured</span>
                </div>
                <ConfidenceIndicator confidence={overallConfidence} size="sm" />
              </div>

              {/* Badge Type if detected */}
              {badgeType && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {badgeType}
                </Badge>
              )}

              {/* Form Fields with Confidence */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <LowConfidenceField
                    label="first name"
                    value={editedData.firstName}
                    onChange={(v) => setEditedData(prev => ({ ...prev, firstName: v }))}
                    confidence={fieldConfidence.firstName}
                    placeholder="jane"
                  />
                  <LowConfidenceField
                    label="last name"
                    value={editedData.lastName}
                    onChange={(v) => setEditedData(prev => ({ ...prev, lastName: v }))}
                    confidence={fieldConfidence.lastName}
                    placeholder="doe"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">email</Label>
                    {enrichmentNeeded && (
                      <EnrichmentButton
                        firstName={editedData.firstName}
                        lastName={editedData.lastName}
                        company={editedData.company}
                        onEnriched={handleEnrichmentComplete}
                      />
                    )}
                  </div>
                  <LowConfidenceField
                    label=""
                    value={editedData.email}
                    onChange={(v) => setEditedData(prev => ({ ...prev, email: v }))}
                    confidence={fieldConfidence.email}
                    placeholder="jane@company.com"
                    type="email"
                  />
                </div>

                <LowConfidenceField
                  label="company"
                  value={editedData.company}
                  onChange={(v) => setEditedData(prev => ({ ...prev, company: v }))}
                  confidence={fieldConfidence.company}
                  placeholder="acme inc"
                />

                <LowConfidenceField
                  label="title"
                  value={editedData.title}
                  onChange={(v) => setEditedData(prev => ({ ...prev, title: v }))}
                  confidence={fieldConfidence.title}
                  placeholder="marketing manager"
                />

                <div>
                  <Label className="text-muted-foreground">notes</Label>
                  <Input
                    value={editedData.notes}
                    onChange={(e) => setEditedData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="add quick notes..."
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={saveLead} className="flex-1 gap-2">
                  <Check className="h-4 w-4" />
                  save lead
                </Button>
                <Button variant="outline" onClick={resetScanner}>
                  scan another
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Scans */}
      {scans.length > 0 && (
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-2">
            recent scans ({scans.length})
          </p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {scans.slice(-3).reverse().map(scan => (
              <div 
                key={scan.id} 
                className={cn(
                  "flex items-center justify-between text-sm p-2 rounded",
                  scan.needsReview ? "bg-yellow-500/10" : "bg-muted/50"
                )}
              >
                <span className="truncate">
                  {scan.firstName} {scan.lastName}
                </span>
                <div className="flex items-center gap-1">
                  {scan.synced ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
