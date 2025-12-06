import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Link2, 
  Sparkles, 
  Upload, 
  Download, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Hash,
  Globe,
  Zap
} from "lucide-react";
import { generateSlugFromTitle } from "@/lib/slugify";
import { HintTooltip } from "@/components/bulk-upload/shared/HintTooltip";
import { SectionCard } from "@/components/bulk-upload/shared/SectionCard";
import { useGTMEvents } from "@/components/integrations/GTMProvider";

interface ProcessedURL {
  id: string;
  original: string;
  short: string;
  slug: string;
  domain: string;
  status: "success" | "error";
  error?: string;
}

interface BulkURLShortenerToolProps {
  workspaceId: string;
}

export const BulkURLShortenerTool = ({ workspaceId }: BulkURLShortenerToolProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { trackBulkUpload, trackToolOpened } = useGTMEvents();
  const [bulkInput, setBulkInput] = useState("");
  const [processedURLs, setProcessedURLs] = useState<ProcessedURL[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("utm.click");
  const [activeTab, setActiveTab] = useState("smart");
  
  const [smartOptions, setSmartOptions] = useState({
    autoAlias: true,
    addUTM: false,
    cleanQueryParams: false,
    groupByDomain: false,
  });

  // Track tool opened
  useEffect(() => {
    trackToolOpened('bulk_url_shortener');
  }, [trackToolOpened]);

  // Fetch verified domains
  const { data: verifiedDomains } = useQuery({
    queryKey: ["verified-domains", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("id, domain, workspace_id")
        .eq("is_verified", true)
        .or(`workspace_id.eq.${workspaceId},is_system_domain.eq.true`)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      return (data || []).filter(d => d.domain !== 'utm.one');
    },
  });

  // Generate smart alias from URL
  const generateSmartAlias = (url: string, index: number): string => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').split('.')[0];
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const cleanPart = generateSlugFromTitle(lastPart).slice(0, 15);
        return `${domain}-${cleanPart}-${index}`;
      }
      
      return `${domain}-${index}`;
    } catch (e) {
      return `link-${index}`;
    }
  };

  // Process URLs mutation
  const processURLsMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

      const urlLines = bulkInput.split('\n').filter(line => line.trim());
      const links = urlLines.map((url, index) => {
        const trimmedUrl = url.trim();
        let finalUrl = trimmedUrl;

        // Apply smart options
        if (smartOptions.cleanQueryParams) {
          try {
            const urlObj = new URL(trimmedUrl);
            urlObj.search = '';
            finalUrl = urlObj.toString();
          } catch (e) {
            finalUrl = trimmedUrl;
          }
        }

        if (smartOptions.addUTM) {
          const separator = finalUrl.includes('?') ? '&' : '?';
          finalUrl = `${finalUrl}${separator}utm_source=bulk&utm_medium=shortener`;
        }

        const slug = smartOptions.autoAlias 
          ? generateSmartAlias(trimmedUrl, index + 1)
          : `link-${index + 1}`;

        return {
          destination_url: finalUrl,
          title: `Bulk Link ${index + 1}`,
          slug,
        };
      });

      const { data, error } = await supabase.functions.invoke('bulk-create-links', {
        body: {
          workspace_id: workspaceId,
          domain: selectedDomain,
          links,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const results: ProcessedURL[] = data.results.map((result: any) => ({
        id: result.link?.id || Math.random().toString(),
        original: result.destination_url,
        short: result.link ? `https://${selectedDomain}/${result.link.slug}` : '',
        slug: result.link?.slug || '',
        domain: selectedDomain,
        status: result.success ? 'success' : 'error',
        error: result.error,
      }));

      setProcessedURLs(results);
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      
      // Track bulk upload completion
      trackBulkUpload('bulk', data.total, data.created);
      
      toast({
        title: "links created",
        description: `${data.created} of ${data.total} links created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setBulkInput(content);
      };
      reader.readAsText(file);
    }
  };

  // Export functions
  const exportURLs = (format: 'txt' | 'csv' | 'json') => {
    let content = '';
    
    if (format === 'csv') {
      content = 'Original URL,Short URL,Slug,Status,Error\n';
      processedURLs.forEach(url => {
        content += `"${url.original}","${url.short}","${url.slug}","${url.status}","${url.error || ''}"\n`;
      });
    } else if (format === 'json') {
      content = JSON.stringify(processedURLs, null, 2);
    } else {
      processedURLs.forEach(url => {
        if (url.status === 'success') {
          content += `${url.short}\n`;
        }
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-links-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "copied",
      description: "link copied to clipboard",
    });
  };

  const urlCount = bulkInput.split('\n').filter(line => line.trim()).length;
  const successCount = processedURLs.filter(u => u.status === 'success').length;
  const errorCount = processedURLs.filter(u => u.status === 'error').length;
  const uniqueDomains = new Set(processedURLs.map(u => {
    try {
      return new URL(u.original).hostname;
    } catch {
      return 'invalid';
    }
  })).size;

  // Group URLs by domain if enabled
  const groupedURLs = smartOptions.groupByDomain 
    ? processedURLs.reduce((acc, url) => {
        try {
          const domain = new URL(url.original).hostname;
          if (!acc[domain]) acc[domain] = [];
          acc[domain].push(url);
          return acc;
        } catch {
          if (!acc['invalid']) acc['invalid'] = [];
          acc['invalid'].push(url);
          return acc;
        }
      }, {} as Record<string, ProcessedURL[]>)
    : { 'all': processedURLs };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="smart">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Smart mode
                  </TabsTrigger>
                  <TabsTrigger value="manual">Manual mode</TabsTrigger>
                </TabsList>

                <TabsContent value="smart" className="space-y-6 mt-6">
                  {/* Smart Options */}
                  <SectionCard 
                    title="Smart processing options" 
                    hint="Auto-enhance your links with intelligent defaults"
                    collapsible
                    defaultOpen
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="autoAlias" className="cursor-pointer">
                            Auto-generate smart aliases
                          </Label>
                          <HintTooltip content="creates readable slugs like 'linkedin-yourname' instead of random characters" />
                        </div>
                        <Switch
                          id="autoAlias"
                          checked={smartOptions.autoAlias}
                          onCheckedChange={(checked) => 
                            setSmartOptions({ ...smartOptions, autoAlias: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="addUTM" className="cursor-pointer">
                            Add UTM tracking parameters
                          </Label>
                          <HintTooltip content="appends utm_source=bulk&utm_medium=shortener to track link performance in analytics" />
                        </div>
                        <Switch
                          id="addUTM"
                          checked={smartOptions.addUTM}
                          onCheckedChange={(checked) => 
                            setSmartOptions({ ...smartOptions, addUTM: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="cleanQueryParams" className="cursor-pointer">
                            Clean query parameters
                          </Label>
                          <HintTooltip content="removes existing ?query=params from URLs for cleaner links" />
                        </div>
                        <Switch
                          id="cleanQueryParams"
                          checked={smartOptions.cleanQueryParams}
                          onCheckedChange={(checked) => 
                            setSmartOptions({ ...smartOptions, cleanQueryParams: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="groupByDomain" className="cursor-pointer">
                            Group results by domain
                          </Label>
                          <HintTooltip content="organizes processed links by their original website for easier review" />
                        </div>
                        <Switch
                          id="groupByDomain"
                          checked={smartOptions.groupByDomain}
                          onCheckedChange={(checked) => 
                            setSmartOptions({ ...smartOptions, groupByDomain: checked })
                          }
                        />
                      </div>
                    </div>
                  </SectionCard>

                  {/* Domain Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="domain">Custom domain</Label>
                      <HintTooltip content="your branded domain increases trust and click-through rates" />
                    </div>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                      <SelectTrigger id="domain">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {verifiedDomains?.map((d) => (
                          <SelectItem key={d.id} value={d.domain}>
                            {d.domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="mt-6">
                  <div className="space-y-4">
                    <Label htmlFor="domain">Custom domain</Label>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                      <SelectTrigger id="domain">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {verifiedDomains?.map((d) => (
                          <SelectItem key={d.id} value={d.domain}>
                            {d.domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paste URLs</CardTitle>
              <CardDescription>One URL per line</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://another-site.com/article"
                className="min-h-[200px] font-mono text-sm"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {urlCount} {urlCount === 1 ? 'URL' : 'URLs'} detected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".txt,.csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    onClick={() => processURLsMutation.mutate()}
                    disabled={!bulkInput.trim() || processURLsMutation.isPending}
                  >
                    {processURLsMutation.isPending ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Process URLs
                      </>
                    )}
                  </Button>
                </div>
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
                <CardTitle className="text-lg">Shortened links</CardTitle>
                {processedURLs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-lg text-sm font-medium bg-primary/10 text-primary">
                    {processedURLs.length}
                  </span>
                )}
              </div>
              
              {processedURLs.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportURLs('txt')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    TXT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportURLs('csv')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportURLs('json')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    JSON
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {processedURLs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No links processed yet</p>
                  <p className="text-xs mt-2">Add URLs and click Process to get started</p>
                </div>
              ) : (
                Object.entries(groupedURLs).map(([domain, urls]) => (
                  <div key={domain} className="space-y-2">
                    {smartOptions.groupByDomain && domain !== 'all' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono py-2">
                        <Globe className="h-3 w-3" />
                        {domain}
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">
                          {urls.length}
                        </span>
                      </div>
                    )}
                    
                    {urls.map((url) => (
                      <div
                        key={url.id}
                        className={`group p-4 rounded-lg border transition-all ${
                          url.status === 'error'
                            ? 'border-destructive/50 bg-destructive/5'
                            : 'border-border hover:border-white/30 bg-card'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {url.status === 'error' ? (
                                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-system-green flex-shrink-0" />
                              )}
                              <p className="text-sm text-muted-foreground truncate">
                                {url.original}
                              </p>
                            </div>
                            
                            {url.status === 'success' ? (
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-sm truncate text-primary">
                                  {url.short}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => copyToClipboard(url.short)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-destructive">{url.error}</p>
                            )}
                          </div>
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
      {processedURLs.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total processed</p>
                <p className="text-2xl font-display font-semibold">{processedURLs.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-display font-semibold text-system-green">
                  {successCount}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-display font-semibold text-destructive">
                  {errorCount}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unique domains</p>
                <p className="text-2xl font-display font-semibold">{uniqueDomains}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
