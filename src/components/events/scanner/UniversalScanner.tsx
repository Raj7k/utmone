import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  QrCode, 
  Scan, 
  Check, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Linkedin, 
  RefreshCw,
  WifiOff,
  Cloud,
  X,
  ImageIcon
} from "lucide-react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseBadgeData, ParsedBadgeData, splitFullName } from "./parseBadgeData";
import { useOfflineScans, OfflineScan } from "./useOfflineScans";

interface UniversalScannerProps {
  eventId: string;
  eventName: string;
  onScanComplete?: () => void;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'encrypted' | 'ocr-needed' | 'processing';

export const UniversalScanner = ({ eventId, eventName, onScanComplete }: UniversalScannerProps) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [parsedData, setParsedData] = useState<ParsedBadgeData | null>(null);
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    title: '',
    notes: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const { scans, pendingCount, isSyncing, isOnline, addScan, syncScans } = useOfflineScans(eventId);

  // Initialize QR scanner
  useEffect(() => {
    const scannerId = "qr-reader";
    
    if (document.getElementById(scannerId) && !scannerRef.current) {
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
          // Suppress frequent scan errors
          if (!errorMessage.includes('No QR code found')) {
            console.log('Scan error:', errorMessage);
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  // Handle successful QR scan
  const handleQRSuccess = useCallback((decodedText: string) => {
    // Vibrate on success
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }

    const parsed = parseBadgeData(decodedText);
    setParsedData(parsed);

    if (parsed.parseMethod === 'encrypted' || parsed.confidence < 30) {
      setStatus('ocr-needed');
      toast({
        title: 'code encrypted',
        description: 'tap "capture badge" to read the printed text',
      });
    } else {
      setStatus('success');
      populateEditedData(parsed);
      setShowConfirmDialog(true);
    }
  }, []);

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
  };

  // Capture badge image for OCR
  const captureBadgeImage = async () => {
    setIsOCRProcessing(true);
    setStatus('processing');

    try {
      // Get video element from the scanner
      const videoElement = document.querySelector('#qr-reader video') as HTMLVideoElement;
      
      if (!videoElement) {
        throw new Error('Camera not available');
      }

      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoElement, 0, 0);
      
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);

      // Send to OCR edge function
      const { data, error } = await supabase.functions.invoke('scan-badge-ocr', {
        body: { imageBase64 }
      });

      if (error) throw error;

      if (data && (data.email || data.firstName || data.company)) {
        setParsedData({
          ...data,
          rawData: 'OCR Extracted',
          parseMethod: 'plain',
          confidence: data.confidence || 70
        });
        
        setEditedData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          company: data.company || '',
          title: data.title || '',
          notes: ''
        });
        
        setStatus('success');
        setShowConfirmDialog(true);
        
        toast({
          title: 'badge text extracted',
          description: `confidence: ${data.confidence}%`
        });
      } else {
        throw new Error('Could not extract text from badge');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: 'ocr failed',
        description: 'could not read badge text. please enter manually.',
        variant: 'destructive'
      });
      setStatus('idle');
      setShowConfirmDialog(true);
    } finally {
      setIsOCRProcessing(false);
    }
  };

  // Voice note recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        // In a real implementation, send to speech-to-text API
        // For now, we'll just show a placeholder
        toast({
          title: 'note recorded',
          description: 'voice note saved (transcription coming soon)'
        });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopVoiceRecording();
        }
      }, 10000);
    } catch (error) {
      toast({
        title: 'microphone access denied',
        variant: 'destructive'
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Save the scanned lead
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
    });

    toast({
      title: 'lead saved',
      description: isOnline ? 'synced to cloud' : 'saved offline, will sync later'
    });

    // Reset state
    setShowConfirmDialog(false);
    setStatus('idle');
    setParsedData(null);
    setEditedData({ firstName: '', lastName: '', email: '', company: '', title: '', notes: '' });
    
    onScanComplete?.();
  };

  // Open LinkedIn search
  const searchLinkedIn = () => {
    const query = encodeURIComponent(`${editedData.firstName} ${editedData.lastName} ${editedData.company}`);
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${query}`, '_blank');
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header with sync status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">universal scanner</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600">
              <WifiOff className="h-3 w-3" />
              {pendingCount} pending
            </Badge>
          )}
          
          {isOnline ? (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
              <Cloud className="h-3 w-3" />
              online
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-orange-600 border-orange-600">
              <WifiOff className="h-3 w-3" />
              offline
            </Badge>
          )}
          
          {pendingCount > 0 && isOnline && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={syncScans}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Scanner viewport */}
      <div className="relative rounded-xl overflow-hidden bg-black">
        <div 
          id="qr-reader" 
          className="w-full"
          style={{ minHeight: '300px' }}
        />
        
        {/* Status overlay */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-green-500 rounded-full p-4">
                <Check className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          )}
          
          {status === 'ocr-needed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-yellow-500 rounded-full p-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          )}
          
          {status === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-white animate-spin mx-auto mb-2" />
                <p className="text-white text-sm">reading badge...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OCR Capture Button */}
      <AnimatePresence>
        {(status === 'ocr-needed' || status === 'idle') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button 
              onClick={captureBadgeImage}
              disabled={isOCRProcessing}
              variant="outline"
              className="w-full gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {isOCRProcessing ? 'reading badge...' : 'capture badge text (ai ocr)'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual entry button */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => {
          setStatus('idle');
          setShowConfirmDialog(true);
        }}
        className="w-full"
      >
        enter manually
      </Button>

      {/* Recent scans */}
      {scans.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">recent scans ({scans.length})</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {scans.slice(-5).reverse().map(scan => (
              <div 
                key={scan.id} 
                className="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
              >
                <span className="truncate">
                  {scan.firstName} {scan.lastName} {scan.email && `(${scan.email})`}
                </span>
                <div className="flex items-center gap-1">
                  {scan.synced ? (
                    <Cloud className="h-3 w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm/Edit Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md bg-card border-border z-[100]">
          <DialogHeader>
            <DialogTitle className="font-display">confirm lead</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">first name</Label>
                <Input 
                  value={editedData.firstName}
                  onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">last name</Label>
                <Input 
                  value={editedData.lastName}
                  onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">email</Label>
              <Input 
                type="email"
                value={editedData.email}
                onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">company</Label>
              <Input 
                value={editedData.company}
                onChange={(e) => setEditedData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Acme Corp"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">title</Label>
              <Input 
                value={editedData.title}
                onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="VP of Marketing"
              />
            </div>
            
            {/* Voice note */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">notes</Label>
              <div className="flex gap-2">
                <Textarea 
                  value={editedData.notes}
                  onChange={(e) => setEditedData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="interested in enterprise plan..."
                  className="flex-1 min-h-[60px]"
                />
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className="shrink-0"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              {isRecording && (
                <p className="text-xs text-red-500 animate-pulse">recording... (10s max)</p>
              )}
            </div>
            
            {/* LinkedIn search */}
            {(editedData.firstName || editedData.lastName) && (
              <Button
                type="button"
                variant="outline"
                onClick={searchLinkedIn}
                className="w-full gap-2"
              >
                <Linkedin className="h-4 w-4" />
                find on linkedin
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
              >
                cancel
              </Button>
              <Button 
                onClick={saveLead}
                className="flex-1"
              >
                save lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};