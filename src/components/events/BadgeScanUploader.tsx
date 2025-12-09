import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BadgeScanUploaderProps {
  eventId: string;
  onUploadComplete: () => void;
}

interface ParsedRow {
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
}

export const BadgeScanUploader = ({ eventId, onUploadComplete }: BadgeScanUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const emailIndex = headers.findIndex(h => h.includes('email'));
    const firstNameIndex = headers.findIndex(h => h.includes('first') || h === 'name');
    const lastNameIndex = headers.findIndex(h => h.includes('last'));
    const companyIndex = headers.findIndex(h => h.includes('company') || h.includes('organization'));
    const titleIndex = headers.findIndex(h => h.includes('title') || h.includes('role') || h.includes('position'));
    
    if (emailIndex === -1) {
      throw new Error('CSV must contain an email column');
    }
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      return {
        email: values[emailIndex] || '',
        first_name: firstNameIndex >= 0 ? values[firstNameIndex] : undefined,
        last_name: lastNameIndex >= 0 ? values[lastNameIndex] : undefined,
        company: companyIndex >= 0 ? values[companyIndex] : undefined,
        title: titleIndex >= 0 ? values[titleIndex] : undefined,
      };
    }).filter(row => row.email && row.email.includes('@'));
  };

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length === 0) {
        throw new Error('No valid rows found in CSV');
      }
      
      let success = 0;
      let failed = 0;
      
      // Insert in batches
      const batchSize = 50;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize).map(row => ({
          event_id: eventId,
          email: row.email,
          first_name: row.first_name,
          last_name: row.last_name,
          company: row.company,
          title: row.title,
          scanned_at: new Date().toISOString(),
        }));
        
        const { error } = await supabase
          .from('event_badge_scans')
          .insert(batch);
        
        if (error) {
          failed += batch.length;
          console.error('Batch insert error:', error);
        } else {
          success += batch.length;
        }
      }
      
      setUploadResult({ success, failed });
      
      if (success > 0) {
        toast({
          title: "badge scans imported",
          description: `${success} contacts added successfully`,
        });
        onUploadComplete();
      }
      
      if (failed > 0) {
        toast({
          title: "some imports failed",
          description: `${failed} contacts could not be imported`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "upload failed",
        description: error instanceof Error ? error.message : "failed to parse CSV",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [eventId, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleUpload(file);
    } else {
      toast({
        title: "invalid file",
        description: "please upload a CSV file",
        variant: "destructive",
      });
    }
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-4">import badge scans</h3>
      
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-muted-foreground">uploading...</p>
            </>
          ) : uploadResult ? (
            <>
              {uploadResult.failed === 0 ? (
                <CheckCircle className="w-8 h-8 text-primary" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              )}
              <p className="text-foreground font-medium">
                {uploadResult.success} imported
                {uploadResult.failed > 0 && `, ${uploadResult.failed} failed`}
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setUploadResult(null)}
              >
                upload another
              </Button>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                drag & drop CSV file or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                columns: email (required), first_name, last_name, company, title
              </p>
            </>
          )}
        </div>
      </motion.div>
    </Card>
  );
};
