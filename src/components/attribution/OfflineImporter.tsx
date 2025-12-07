import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';
import { useImportBatches } from '@/hooks/useAttribution';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface CSVRow {
  email: string;
  revenue: number;
  conversion_date: string;
  metadata?: Record<string, unknown>;
}

interface ColumnMapping {
  email: string;
  revenue: string;
  date: string;
}

export const OfflineImporter: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const { data: batches, isLoading: batchesLoading } = useImportBatches(currentWorkspace?.id);
  
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({ email: '', revenue: '', date: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ matched: number; unmatched: number; matchRate: number } | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const parsed = lines.map(line => {
        // Handle quoted CSV values
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      });

      if (parsed.length > 0) {
        setHeaders(parsed[0]);
        setCsvData(parsed.slice(1));
        
        // Auto-detect column mapping
        const headerLower = parsed[0].map(h => h.toLowerCase());
        const autoMapping: ColumnMapping = {
          email: parsed[0][headerLower.findIndex(h => h.includes('email'))] || '',
          revenue: parsed[0][headerLower.findIndex(h => h.includes('value') || h.includes('revenue') || h.includes('amount'))] || '',
          date: parsed[0][headerLower.findIndex(h => h.includes('date') || h.includes('time') || h.includes('timestamp'))] || '',
        };
        setMapping(autoMapping);
      }
    };
    reader.readAsText(uploadedFile);
  }, []);

  const handleImport = async () => {
    if (!currentWorkspace?.id || !mapping.email || !mapping.date) {
      toast.error('Please map email and date columns');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const emailIdx = headers.indexOf(mapping.email);
      const revenueIdx = headers.indexOf(mapping.revenue);
      const dateIdx = headers.indexOf(mapping.date);

      const conversions: CSVRow[] = csvData
        .filter(row => row[emailIdx]?.trim())
        .map(row => ({
          email: row[emailIdx]?.trim() || '',
          revenue: parseFloat(row[revenueIdx]) || 0,
          conversion_date: row[dateIdx]?.trim() || new Date().toISOString(),
        }));

      const { data, error } = await supabase.functions.invoke('reconcile-offline', {
        body: {
          workspace_id: currentWorkspace.id,
          conversions,
          source_file: file?.name,
        },
      });

      if (error) throw error;

      setResult({
        matched: data.matched_rows,
        unmatched: data.unmatched_rows,
        matchRate: data.match_rate,
      });

      queryClient.invalidateQueries({ queryKey: ['import-batches'] });
      queryClient.invalidateQueries({ queryKey: ['attribution'] });

      toast.success(`Import complete: ${data.match_rate}% match rate`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'Email,Revenue,Date\njohn@example.com,1500,2024-01-15\njane@example.com,2500,2024-01-16';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'offline_conversions_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Upload className="h-5 w-5" />
            import offline conversions
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            upload sales data from your CRM to attribute offline conversions to online campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground font-medium">
                {file ? file.name : 'drop your CSV here or click to upload'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {file ? `${csvData.length} rows detected` : 'supports .csv files with email, revenue, and date columns'}
              </p>
            </label>
          </div>

          {/* Column Mapping */}
          {headers.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">email column</label>
                <select
                  value={mapping.email}
                  onChange={(e) => setMapping(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full mt-1 p-2 rounded-md bg-muted border border-border text-foreground"
                >
                  <option value="">select column</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">revenue column</label>
                <select
                  value={mapping.revenue}
                  onChange={(e) => setMapping(prev => ({ ...prev, revenue: e.target.value }))}
                  className="w-full mt-1 p-2 rounded-md bg-muted border border-border text-foreground"
                >
                  <option value="">select column</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">date column</label>
                <select
                  value={mapping.date}
                  onChange={(e) => setMapping(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full mt-1 p-2 rounded-md bg-muted border border-border text-foreground"
                >
                  <option value="">select column</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">match rate</span>
                <Badge variant={result.matchRate >= 70 ? 'default' : result.matchRate >= 40 ? 'secondary' : 'destructive'}>
                  {result.matchRate}%
                </Badge>
              </div>
              <Progress value={result.matchRate} className="h-2" />
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  {result.matched} matched
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  {result.unmatched} unmatched
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={!file || !mapping.email || !mapping.date || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'processing...' : 'import & reconcile'}
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">import history</CardTitle>
        </CardHeader>
        <CardContent>
          {batchesLoading ? (
            <p className="text-muted-foreground">loading...</p>
          ) : batches?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">no imports yet</p>
          ) : (
            <div className="space-y-3">
              {batches?.map((batch) => (
                <div 
                  key={batch.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{batch.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(batch.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {batch.matched_rows}/{batch.total_rows} matched
                    </span>
                    <Badge variant={batch.status === 'completed' ? 'default' : batch.status === 'failed' ? 'destructive' : 'secondary'}>
                      {batch.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
