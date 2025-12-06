import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Download, XCircle } from "lucide-react";
import type { BatchResult } from "@/hooks/useBatchProcessor";

interface ErrorRecoveryProps {
  failedResults: BatchResult[];
  onRetry: (urls: string[]) => Promise<void>;
  onDismiss: () => void;
}

export function ErrorRecovery({ failedResults, onRetry, onDismiss }: ErrorRecoveryProps) {
  const [retrying, setRetrying] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  if (failedResults.length === 0) {
    return null;
  }

  const handleRetrySelected = async () => {
    if (selectedUrls.size === 0) return;
    
    setRetrying(true);
    try {
      await onRetry(Array.from(selectedUrls));
    } finally {
      setRetrying(false);
      setSelectedUrls(new Set());
    }
  };

  const handleRetryAll = async () => {
    setRetrying(true);
    try {
      await onRetry(failedResults.map(r => r.url));
    } finally {
      setRetrying(false);
    }
  };

  const toggleUrl = (url: string) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedUrls(newSelected);
  };

  const exportErrors = () => {
    const csv = [
      'URL,Error',
      ...failedResults.map(r => `"${r.url}","${r.error}"`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `failed-links-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card style={{ borderColor: 'rgba(239,68,68,0.5)' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: 'rgba(239,68,68,0.8)' }} />
            <CardTitle className="font-display text-title-2">
              {failedResults.length} link{failedResults.length !== 1 ? 's' : ''} failed
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>Review errors and retry failed links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Common causes: invalid URL format, duplicate slug, rate limiting, network issues
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={handleRetryAll} 
            disabled={retrying}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
            Retry all
          </Button>
          <Button 
            onClick={handleRetrySelected} 
            disabled={retrying || selectedUrls.size === 0}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
            Retry selected ({selectedUrls.size})
          </Button>
          <Button onClick={exportErrors} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export errors
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {failedResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedUrls.has(result.url) ? 'bg-primary/5 border-primary/50' : 'border-border'}`}
              onClick={() => toggleUrl(result.url)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.url}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(239,68,68,0.8)' }}>{result.error}</p>
                </div>
                <Badge variant={selectedUrls.has(result.url) ? "default" : "outline"} className="text-xs">
                  {selectedUrls.has(result.url) ? 'selected' : 'select'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}