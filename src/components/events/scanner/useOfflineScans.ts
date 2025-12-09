import { useState, useEffect, useCallback } from 'react';
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
}

const STORAGE_KEY = 'utm_one_offline_scans';

// Get scans from IndexedDB/localStorage
function getStoredScans(): OfflineScan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save scans to IndexedDB/localStorage
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

  // Load scans on mount
  useEffect(() => {
    const allScans = getStoredScans();
    const eventScans = allScans.filter(s => s.eventId === eventId);
    setScans(eventScans);
    setPendingCount(eventScans.filter(s => !s.synced).length);
  }, [eventId]);

  // Listen for online/offline status
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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add a new scan (saves locally first)
  const addScan = useCallback((scan: Omit<OfflineScan, 'id' | 'synced' | 'scannedAt'>) => {
    const newScan: OfflineScan = {
      ...scan,
      id: crypto.randomUUID(),
      scannedAt: new Date().toISOString(),
      synced: false,
      eventId
    };

    const allScans = getStoredScans();
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

  // Sync all pending scans
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

  return {
    scans,
    pendingCount,
    isSyncing,
    isOnline,
    addScan,
    syncScans,
    updateNotes,
    deleteScan
  };
}