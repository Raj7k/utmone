import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, X, Zap, Flashlight, FlashlightOff,
  Scan, RefreshCw
} from "lucide-react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { parseBadgeData, splitFullName } from "./parseBadgeData";
import { useOfflineScans } from "./useOfflineScans";
import { ScanCounter } from "./ScanCounter";
import { LeadCaptureSheet } from "./LeadCaptureSheet";
import { SuccessAnimation } from "./SuccessAnimation";
import { haptics, LeadTemperature } from "./useHaptics";

interface OneTapScanner2Props {
  eventId: string;
  eventName: string;
  onViewLeads?: () => void;
}

type ScanPhase = 'camera' | 'processing' | 'capture';

interface CapturedLead {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
}

/**
 * One-Tap Scanner 2.0
 * Full-screen camera-first experience with quick lead qualification
 * Optimized for speed and one-handed mobile use
 */
export const OneTapScanner2 = ({ eventId, eventName, onViewLeads }: OneTapScanner2Props) => {
  const [phase, setPhase] = useState<ScanPhase>('camera');
  const [capturedLead, setCapturedLead] = useState<CapturedLead | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerId = "onetap-scanner-v2";

  const { 
    scans, 
    pendingCount, 
    isOnline, 
    addScan 
  } = useOfflineScans(eventId);

  // Initialize camera on mount
  useEffect(() => {
    initCamera();
    return () => cleanup();
  }, []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = stream;
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const container = document.getElementById(scannerId);
        if (container && !scannerRef.current) {
          scannerRef.current = new Html5QrcodeScanner(
            scannerId,
            {
              fps: 15,
              qrbox: { width: 280, height: 280 },
              supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
              rememberLastUsedCamera: true,
              aspectRatio: 1,
            },
            false
          );

          scannerRef.current.render(
            handleQRSuccess,
            () => {} // Silent scan failures
          );
          
          setCameraReady(true);
        }
      }, 100);
    } catch (error) {
      console.error('Camera init error:', error);
      haptics.error();
    }
  };

  const cleanup = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleQRSuccess = useCallback((decodedText: string) => {
    haptics.scanSuccess();
    
    const parsed = parseBadgeData(decodedText);
    
    if (parsed.parseMethod === 'encrypted' || parsed.confidence < 30) {
      captureAndOCR();
    } else {
      processScannedData(parsed);
    }
  }, []);

  const processScannedData = (data: any) => {
    let firstName = data.firstName || '';
    let lastName = data.lastName || '';
    
    if (!firstName && data.fullName) {
      const split = splitFullName(data.fullName);
      firstName = split.firstName;
      lastName = split.lastName;
    }

    const lead: CapturedLead = {
      firstName,
      lastName,
      email: data.email || '',
      company: data.company || '',
      title: data.title || '',
    };

    setCapturedLead(lead);
    setPhase('capture');
    setShowSheet(true);
  };

  const captureAndOCR = async () => {
    setPhase('processing');
    haptics.tap();

    try {
      const videoElement = document.querySelector(`#${scannerId} video`) as HTMLVideoElement;
      
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

      if (data && (data.email || data.firstName || data.company)) {
        haptics.scanSuccess();
        
        processScannedData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          company: data.company || '',
          title: data.title || '',
          confidence: data.confidence || 70
        });
      } else {
        throw new Error('Could not read badge');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      haptics.error();
      setPhase('camera');
    }
  };

  const handleSaveLead = (temperature: LeadTemperature, notes: string) => {
    if (!capturedLead) return;

    addScan({
      eventId,
      email: capturedLead.email,
      firstName: capturedLead.firstName,
      lastName: capturedLead.lastName,
      company: capturedLead.company,
      title: capturedLead.title,
      notes: notes,
      // @ts-ignore - new fields
      leadTemperature: temperature,
      quickNotes: notes
    });

    setShowSheet(false);
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setCapturedLead(null);
    setPhase('camera');
  };

  const handleViewDetails = () => {
    // For now, just close the sheet
    // In future, could expand to full form
    setShowSheet(false);
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        // @ts-ignore - torch is a valid constraint
        await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
        setTorchOn(!torchOn);
        haptics.tap();
      } catch (e) {
        console.log('Torch not supported');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between safe-area-inset-top">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => window.history.back()}
          className="text-white bg-black/40 backdrop-blur-sm hover:bg-black/60"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <ScanCounter 
          count={scans.length}
          pendingCount={pendingCount}
          isOnline={isOnline}
          onClick={onViewLeads}
        />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTorch}
          className="text-white bg-black/40 backdrop-blur-sm hover:bg-black/60"
        >
          {torchOn ? (
            <Flashlight className="w-5 h-5 text-amber-400" />
          ) : (
            <FlashlightOff className="w-5 h-5" />
          )}
        </Button>
      </header>

      {/* Camera view */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {phase === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <div 
                id={scannerId}
                className="w-full h-full"
              />
              
              {/* Camera warming indicator */}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCw className="w-8 h-8 text-white/60" />
                    </motion.div>
                    <p className="text-white/60 text-sm">getting camera ready...</p>
                  </div>
                </div>
              )}
              
              {/* Scan frame overlay */}
              {cameraReady && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-72 h-72 relative">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/80 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/80 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/80 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/80 rounded-br-lg" />
                    
                    {/* Scanning line animation */}
                    <motion.div
                      animate={{ y: [0, 250, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                  <RefreshCw className="w-12 h-12 text-white" />
                </motion.div>
                <div className="text-center">
                  <p className="text-white text-lg font-medium">reading badge...</p>
                  <p className="text-white/50 text-sm mt-1">AI extracting contact info</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 safe-area-inset-bottom">
        <Button
          size="lg"
          onClick={captureAndOCR}
          disabled={phase === 'processing' || !cameraReady}
          className={cn(
            "w-full h-14 text-lg gap-2",
            "bg-white/10 backdrop-blur-md border border-white/20",
            "hover:bg-white/20 text-white"
          )}
        >
          <Camera className="w-5 h-5" />
          capture badge (AI)
        </Button>
        
        {/* Battery saver indicator */}
        <div className="flex justify-center mt-3">
          <span className="text-white/40 text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" />
            battery-optimized scanning
          </span>
        </div>
      </div>

      {/* Lead capture sheet */}
      <LeadCaptureSheet
        open={showSheet}
        onOpenChange={setShowSheet}
        lead={capturedLead}
        onSave={handleSaveLead}
        onViewDetails={handleViewDetails}
      />

      {/* Success animation */}
      <SuccessAnimation
        show={showSuccess}
        name={capturedLead?.firstName}
        onComplete={handleSuccessComplete}
      />
    </div>
  );
};
