import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OfflineScan {
  id: string;
  eventId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  scannedAt: string;
  synced: boolean;
  // Reliability engine fields
  confidence?: number;
  needsReview?: boolean;
  rawData?: string;
  photoBlob?: string;
  dedupeHash?: string;
}

const STORAGE_KEY = 'utm_one_offline_scans';
const SYNC_INTERVAL = 30000; // 30 seconds

// Generate deduplication hash from email or name+company
function generateDedupeHash(scan: Partial<OfflineScan>): string {
  if (scan.email) {
    return `email:${scan.email.toLowerCase().trim()}`;
  }
  const name = `${scan.firstName || ''}${scan.lastName || ''}`.toLowerCase().replace(/\s/g, '');
  const company = (scan.company || '').toLowerCase().replace(/\s/g, '');
  return `name:${name}:${company}`;
}

// Check for duplicates in existing scans
function findDuplicate(scans: OfflineScan[], newHash: string): OfflineScan | undefined {
  return scans.find(s => s.dedupeHash === newHash);
}

// Validate field confidence and check for "ghost patterns"
function validateFieldConfidence(value: string | undefined, fieldType: 'email' | 'phone' | 'name'): { valid: boolean; confidence: number } {
  if (!value) return { valid: true, confidence: 100 };
  
  switch (fieldType) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasAt = value.includes('@');
      const hasDot = value.includes('.');
      if (!hasAt || !hasDot) return { valid: false, confidence: 20 };
      if (!emailRegex.test(value)) return { valid: false, confidence: 50 };
      return { valid: true, confidence: 95 };
    
    case 'phone':
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 7) return { valid: false, confidence: 30 };
      if (phoneDigits.length < 10) return { valid: false, confidence: 60 };
      return { valid: true, confidence: 90 };
    
    case 'name':
      // Check for OCR artifacts (rn -> m, etc.)
      if (value.length < 2) return { valid: false, confidence: 40 };
      const hasNumbers = /\d/.test(value);
      if (hasNumbers) return { valid: false, confidence: 50 };
      return { valid: true, confidence: 85 };
    
    default:
      return { valid: true, confidence: 80 };
  }
}

// Calculate overall confidence from field validations
function calculateOverallConfidence(scan: Partial<OfflineScan>, ocrConfidence?: number): { confidence: number; needsReview: boolean } {
  const emailCheck = validateFieldConfidence(scan.email, 'email');
  const phoneCheck = validateFieldConfidence(scan.phone, 'phone');
  const nameCheck = validateFieldConfidence(scan.firstName, 'name');
  
  const fieldConfidences = [emailCheck.confidence, nameCheck.confidence];
  if (scan.phone) fieldConfidences.push(phoneCheck.confidence);
  
  const avgFieldConfidence = fieldConfidences.reduce((a, b) => a + b, 0) / fieldConfidences.length;
  const baseConfidence = ocrConfidence || 100;
  
  const overallConfidence = Math.round((avgFieldConfidence + baseConfidence) / 2);
  const needsReview = overallConfidence < 85 || !emailCheck.valid || !nameCheck.valid;
  
  return { confidence: overallConfidence, needsReview };
}

// Get scans from localStorage
function getStoredScans(): OfflineScan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save scans to localStorage
function saveStoredScans(scans: OfflineScan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
  } catch (e) {
    console.error('Failed to save offline scans:', e);
  }
}

export function useOfflineScans(eventId: string) {
  const [scans, setScans] = useState<OfflineScan[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load scans on mount
  useEffect(() => {
    const allScans = getStoredScans();
    const eventScans = allScans.filter(s => s.eventId === eventId);
    setScans(eventScans);
    setPendingCount(eventScans.filter(s => !s.synced).length);
  }, [eventId]);

  // Sync function
  const syncScans = useCallback(async () => {
    if (isSyncing || !navigator.onLine) return;

    const allScans = getStoredScans();
    const pending = allScans.filter(s => !s.synced && s.eventId === eventId);

    if (pending.length === 0) return;

    setIsSyncing(true);

    try {
      const toInsert = pending.map(scan => ({
        event_id: scan.eventId,
        email: scan.email,
        first_name: scan.firstName,
        last_name: scan.lastName,
        company: scan.company,
        title: scan.title,
        scanned_at: scan.scannedAt
      }));

      const { error } = await supabase
        .from('event_badge_scans')
        .insert(toInsert);

      if (!error) {
        // Mark all as synced
        const updated = allScans.map(s => 
          pending.find(p => p.id === s.id) ? { ...s, synced: true } : s
        );
        saveStoredScans(updated);
        
        setScans(prev => prev.map(s => ({ ...s, synced: true })));
        setPendingCount(0);

        toast({
          title: 'scans synced',
          description: `${pending.length} leads uploaded successfully`
        });
      } else {
        console.error('Sync error:', error);
        toast({
          title: 'sync failed',
          description: 'some scans could not be uploaded',
          variant: 'destructive'
        });
      }
    } catch (e) {
      console.error('Sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [eventId, isSyncing]);

  // Listen for online/offline status and auto-sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      syncScans();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up periodic sync every 30 seconds
    syncIntervalRef.current = setInterval(() => {
      if (navigator.onLine) {
        syncScans();
      }
    }, SYNC_INTERVAL);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncScans]);

  // Add a new scan with deduplication and confidence scoring
  const addScan = useCallback((scan: Omit<OfflineScan, 'id' | 'synced' | 'scannedAt' | 'dedupeHash'>, ocrConfidence?: number) => {
    const dedupeHash = generateDedupeHash(scan);
    const allScans = getStoredScans();
    
    // Check for duplicate
    const duplicate = findDuplicate(allScans, dedupeHash);
    
    if (duplicate) {
      // Merge notes instead of creating duplicate
      const mergedNotes = duplicate.notes 
        ? `${duplicate.notes}\n---\n${scan.notes || ''}` 
        : scan.notes;
      
      const updated = allScans.map(s => 
        s.id === duplicate.id 
          ? { ...s, notes: mergedNotes, synced: false }
          : s
      );
      saveStoredScans(updated);
      setScans(prev => prev.map(s => 
        s.id === duplicate.id ? { ...s, notes: mergedNotes, synced: false } : s
      ));
      
      toast({
        title: 'contact updated',
        description: 'merged notes with existing scan'
      });
      
      return duplicate;
    }
    
    // Calculate confidence and review status
    const { confidence, needsReview } = calculateOverallConfidence(scan, ocrConfidence);
    
    const newScan: OfflineScan = {
      ...scan,
      id: crypto.randomUUID(),
      scannedAt: new Date().toISOString(),
      synced: false,
      eventId,
      dedupeHash,
      confidence,
      needsReview
    };

    allScans.push(newScan);
    saveStoredScans(allScans);

    setScans(prev => [...prev, newScan]);
    setPendingCount(prev => prev + 1);

    // Try to sync immediately if online
    if (navigator.onLine) {
      syncSingleScan(newScan);
    }

    return newScan;
  }, [eventId]);

  // Sync a single scan to Supabase
  const syncSingleScan = async (scan: OfflineScan) => {
    try {
      const { error } = await supabase
        .from('event_badge_scans')
        .insert({
          event_id: scan.eventId,
          email: scan.email,
          first_name: scan.firstName,
          last_name: scan.lastName,
          company: scan.company,
          title: scan.title,
          scanned_at: scan.scannedAt
        });

      if (!error) {
        // Mark as synced
        const allScans = getStoredScans();
        const updated = allScans.map(s => 
          s.id === scan.id ? { ...s, synced: true } : s
        );
        saveStoredScans(updated);
        
        setScans(prev => prev.map(s => 
          s.id === scan.id ? { ...s, synced: true } : s
        ));
        setPendingCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error('Failed to sync scan:', e);
    }
  };

  // Update notes for a scan
  const updateNotes = useCallback((scanId: string, notes: string) => {
    const allScans = getStoredScans();
    const updated = allScans.map(s => 
      s.id === scanId ? { ...s, notes } : s
    );
    saveStoredScans(updated);
    
    setScans(prev => prev.map(s => 
      s.id === scanId ? { ...s, notes } : s
    ));
  }, []);

  // Update a scan (for correcting low-confidence fields)
  const updateScan = useCallback((scanId: string, updates: Partial<OfflineScan>) => {
    const allScans = getStoredScans();
    const updated = allScans.map(s => {
      if (s.id === scanId) {
        const newScan = { ...s, ...updates, needsReview: false, synced: false };
        // Recalculate dedupe hash if contact info changed
        if (updates.email || updates.firstName || updates.lastName || updates.company) {
          newScan.dedupeHash = generateDedupeHash(newScan);
        }
        return newScan;
      }
      return s;
    });
    saveStoredScans(updated);
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, ...updates, needsReview: false } : s));
  }, []);

  // Delete a scan
  const deleteScan = useCallback((scanId: string) => {
    const allScans = getStoredScans();
    const filtered = allScans.filter(s => s.id !== scanId);
    saveStoredScans(filtered);
    
    setScans(prev => prev.filter(s => s.id !== scanId));
    setPendingCount(prev => {
      const scan = scans.find(s => s.id === scanId);
      return scan && !scan.synced ? prev - 1 : prev;
    });
  }, [scans]);

  // Get scans that need review
  const getScansNeedingReview = useCallback(() => {
    return scans.filter(s => s.needsReview);
  }, [scans]);

  return {
    scans,
    pendingCount,
    isSyncing,
    isOnline,
    addScan,
    syncScans,
    updateNotes,
    updateScan,
    deleteScan,
    getScansNeedingReview,
    // Expose utility functions for external use
    validateFieldConfidence,
    calculateOverallConfidence
  };
}