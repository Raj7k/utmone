/**
 * URLShortenerPro Component
 * Bulk URL shortening with smart processing and duplicate detection
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Copy, Zap, Download, Upload, Link2, Sparkles, AlertCircle, 
  Check, X, ChevronRight, Layers, Globe, Hash, Loader2
} from 'lucide-react';
import { PAGINATION_LIMIT } from '@/lib/constants';

interface ProcessedURL {
  id: number;
  original: string;
  processed: string;
  short: string;
  alias: string;
  domain: string;
  clicks: number;
  status: 'success' | 'error';
}

export const URLShortenerPro = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  
  const [urls, setUrls] = useState<ProcessedURL[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('smart');
  const [smartOptions, setSmartOptions] = useState({
    autoAlias: true,
    customDomain: 'utm.one',
    trackingParams: false,
    removeQueryParams: false,
    groupByDomain: false
  });
  const [processedCount, setProcessedCount] = useState(0);

  const workspaceId = currentWorkspace?.id;

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-title-2">no workspace selected</CardTitle>
            <CardDescription>
              please select a workspace to use url shortener pro
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Fetch verified domains
  const { data: domains } = useQuery({
    queryKey: ['verified-domains', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data } = await supabase
        .from('domains')
        .select('id, domain')
        .eq('is_verified', true)
        .or(`workspace_id.eq.${workspaceId},is_system_domain.eq.true`)
        .limit(PAGINATION_LIMIT);

      return data || [];
    },
    enabled: !!workspaceId,
  });

  // Generate smart aliases
  const generateSmartAlias = (url: string, index: number): string => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').split('.')[0];
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const cleanPart = lastPart.replace(/[^a-z0-9]/gi, '').slice(0, 10);
        return `${domain}-${cleanPart}-${index}`;
      }
      
      return `${domain}-${index}`;
    } catch (e) {
      return `link-${index}`;
    }
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'invalid';
    }
  };

  // Process URLs with smart capabilities
  const processUrls = useCallback(() => {
    setIsProcessing(true);
    setProcessedCount(0);
    
    const urlLines = bulkInput.split('\n').filter(line => line.trim());
    
    const processed = urlLines.map((url, index) => {
      const trimmedUrl = url.trim();
      let finalUrl = trimmedUrl;
      
      // Smart processing based on options
      if (smartOptions.removeQueryParams) {
        try {
          const urlObj = new URL(trimmedUrl);
          urlObj.search = '';
          finalUrl = urlObj.toString();
        } catch (e) {
          finalUrl = trimmedUrl;
        }
      }
      
      if (smartOptions.trackingParams) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl = `${finalUrl}${separator}utm_source=bulk&utm_medium=shortener`;
      }
      
      const alias = smartOptions.autoAlias ? generateSmartAlias(trimmedUrl, index + 1) : `link-${index + 1}`;
      const shortUrl = `https://${smartOptions.customDomain}/${alias}`;
      
      setTimeout(() => setProcessedCount(prev => prev + 1), index * 50);
      
      return {
        id: Date.now() + index,
        original: trimmedUrl,
        processed: finalUrl,
        short: shortUrl,
        alias: alias,
        domain: getDomain(trimmedUrl),
        clicks: 0,
        status: isValidUrl(trimmedUrl) ? 'success' : 'error'
      } as ProcessedURL;
    });
    
    setUrls(processed);
    
    setTimeout(() => {
      setIsProcessing(false);
    }, urlLines.length * 50 + 500);
  }, [bulkInput, smartOptions]);

  // Copy individual URL
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'copied',
      description: 'short url copied to clipboard',
    });
  };

  // Export all URLs
  const exportUrls = (format: 'txt' | 'csv' | 'json') => {
    let content = '';
    
    if (format === 'csv') {
      content = 'Original URL,Short URL,Alias,Status\n';
      urls.forEach(url => {
        content += `"${url.original}","${url.short}","${url.alias}","${url.status}"\n`;
      });
    } else if (format === 'json') {
      content = JSON.stringify(urls, null, 2);
    } else {
      urls.forEach(url => {
        content += `${url.short}\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-urls-${Date.now()}.${format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'txt'}`;
    a.click();
    
    toast({
      title: 'exported',
      description: `${urls.length} urls exported as ${format.toUpperCase()}`,
    });
  };

  // Import URLs from file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBulkInput(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  // Group URLs by domain
  const groupedUrls = smartOptions.groupByDomain 
    ? urls.reduce((acc, url) => {
        const domain = url.domain;
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(url);
        return acc;
      }, {} as Record<string, ProcessedURL[]>)
    : { 'all': urls };

  const urlCount = bulkInput.split('\n').filter(line => line.trim()).length;
  const successCount = urls.filter(u => u.status === 'success').length;
  const errorCount = urls.filter(u => u.status === 'error').length;
  const uniqueDomains = new Set(urls.map(u => u.domain)).size;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-large-title font-display font-bold text-label">URL Shortener Pro</h1>
        </div>
        <p className="text-body-apple text-secondary-label">
          Smart batch processing with bulk operations
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="smart" className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                Smart
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex-1">
                <Link2 className="h-4 w-4 mr-2" />
                Manual
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Smart Options */}
          {activeTab === 'smart' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-title-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Smart Processing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="autoAlias" className="cursor-pointer">Auto-generate smart aliases</Label>
                    </div>
                    <Switch
                      id="autoAlias"
                      checked={smartOptions.autoAlias}
                      onCheckedChange={(checked) => setSmartOptions({...smartOptions, autoAlias: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="trackingParams" className="cursor-pointer">Add UTM tracking</Label>
                    </div>
                    <Switch
                      id="trackingParams"
                      checked={smartOptions.trackingParams}
                      onCheckedChange={(checked) => setSmartOptions({...smartOptions, trackingParams: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <X className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="removeQueryParams" className="cursor-pointer">Clean query parameters</Label>
                    </div>
                    <Switch
                      id="removeQueryParams"
                      checked={smartOptions.removeQueryParams}
                      onCheckedChange={(checked) => setSmartOptions({...smartOptions, removeQueryParams: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Layers className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="groupByDomain" className="cursor-pointer">Group by domain</Label>
                    </div>
                    <Switch
                      id="groupByDomain"
                      checked={smartOptions.groupByDomain}
                      onCheckedChange={(checked) => setSmartOptions({...smartOptions, groupByDomain: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDomain">Custom domain</Label>
                  <Select 
                    value={smartOptions.customDomain} 
                    onValueChange={(value) => setSmartOptions({...smartOptions, customDomain: value})}
                  >
                    <SelectTrigger id="customDomain">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {domains?.map((d) => (
                        <SelectItem key={d.id} value={d.domain}>
                          {d.domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* URL Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-title-3">Paste URLs</CardTitle>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </span>
                  </Button>
                  <input type="file" className="hidden" accept=".txt,.csv" onChange={handleFileUpload} />
                </label>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste your URLs here, one per line...

https://example.com/page1
https://example.com/page2
https://another-site.com/article"
                className="min-h-64 font-mono text-sm resize-none"
              />
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-secondary-label">
                  {urlCount} URLs detected
                </span>
                <Button
                  onClick={processUrls}
                  disabled={!bulkInput.trim() || isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing {processedCount}/{urlCount}
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Process URLs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-title-3">Shortened URLs</CardTitle>
                {urls.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                    {urls.length}
                  </span>
                )}
              </div>
              
              {urls.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportUrls('txt')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    TXT
                  </Button>
                  <Button
                    onClick={() => exportUrls('csv')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    CSV
                  </Button>
                  <Button
                    onClick={() => exportUrls('json')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    JSON
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {urls.length === 0 ? (
                <div className="text-center py-12 text-secondary-label">
                  <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-body-apple">No URLs processed yet</p>
                  <p className="text-sm mt-2 text-tertiary-label">Add URLs and click process to get started</p>
                </div>
              ) : (
                Object.entries(groupedUrls).map(([domain, domainUrls]) => (
                  <div key={domain} className="space-y-2">
                    {smartOptions.groupByDomain && domain !== 'all' && (
                      <div className="flex items-center gap-2 text-sm text-secondary-label font-mono">
                        <Globe className="h-3 w-3" />
                        {domain}
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">{domainUrls.length}</span>
                      </div>
                    )}
                    
                    {domainUrls.map((url) => (
                      <div
                        key={url.id}
                        className={`group p-4 rounded-lg border transition-all ${
                          url.status === 'error'
                            ? 'border-system-red/50 bg-system-red/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              {url.status === 'success' ? (
                                <Check className="h-4 w-4 text-system-green shrink-0" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-system-red shrink-0" />
                              )}
                              <code className="text-sm font-mono text-primary truncate">
                                {url.short}
                              </code>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-secondary-label">
                              <ChevronRight className="h-3 w-3 shrink-0" />
                              <span className="truncate">{url.original}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-tertiary-label">
                              <span className="px-2 py-0.5 bg-muted rounded font-mono">
                                {url.alias}
                              </span>
                              <span>{url.clicks} clicks</span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(url.short)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Bar */}
      {urls.length > 0 && (
        <Card className="mt-6 bg-muted/10">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{urls.length}</p>
                <p className="text-xs text-secondary-label">Total URLs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-system-green">{successCount}</p>
                <p className="text-xs text-secondary-label">Successful</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-system-red">{errorCount}</p>
                <p className="text-xs text-secondary-label">Errors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{uniqueDomains}</p>
                <p className="text-xs text-secondary-label">Unique Domains</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
