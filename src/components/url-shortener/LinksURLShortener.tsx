import { useState, useMemo } from "react";
import { Copy, Download, Upload, Link2, Sparkles, AlertCircle, Check, X, ChevronRight, Layers, Globe, Hash, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useWorkspace } from "@/hooks/workspace";
import { generateSmartSlug } from "@/lib/smartUrlParser";

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

interface SmartOptions {
  autoAlias: boolean;
  customDomain: string;
  trackingParams: boolean;
  removeQueryParams: boolean;
  groupByDomain: boolean;
}

export const LinksURLShortener = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();

  // Fetch available domains for the workspace
  const { data: workspaceDomains } = useQuery({
    queryKey: ["workspace-domains", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const { data, error } = await supabaseFrom('domains')
        .select("domain")
        .or(`workspace_id.eq.${currentWorkspace.id},is_system_domain.eq.true`)
        .eq("is_verified", true);
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  // Build unique domain list with utm.one as primary default
  const availableDomains = useMemo(() => {
    const domainSet = new Set<string>();
    domainSet.add('utm.one'); // Primary default
    domainSet.add('go.utm.one'); // Secondary system domain
    workspaceDomains?.forEach(d => domainSet.add(d.domain));
    return Array.from(domainSet);
  }, [workspaceDomains]);
  const [urls, setUrls] = useState<ProcessedURL[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("smart");
  const [smartOptions, setSmartOptions] = useState<SmartOptions>({
    autoAlias: true,
    customDomain: "utm.one",
    trackingParams: false,
    removeQueryParams: false,
    groupByDomain: false,
  });
  const [processedCount, setProcessedCount] = useState(0);
  const [hoveredUrl, setHoveredUrl] = useState<number | null>(null);

  const detectPatterns = (urlList: string[]) => {
    const patterns = {
      domains: {} as Record<string, number>,
      paths: {} as Record<string, number>,
      params: new Set<string>(),
    };

    urlList.forEach((url) => {
      try {
        const urlObj = new URL(url);
        patterns.domains[urlObj.hostname] = (patterns.domains[urlObj.hostname] || 0) + 1;

        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        pathParts.forEach((part) => {
          patterns.paths[part] = (patterns.paths[part] || 0) + 1;
        });

        urlObj.searchParams.forEach((value, key) => {
          patterns.params.add(key);
        });
      } catch (e) {
        // Invalid URL
      }
    });

    return patterns;
  };


  const processUrls = async () => {
    setIsProcessing(true);
    setProcessedCount(0);

    const urlLines = bulkInput.split("\n").filter((line) => line.trim());
    const patterns = detectPatterns(urlLines);

    const processed = urlLines.map((url, index) => {
      const trimmedUrl = url.trim();
      let finalUrl = trimmedUrl;

      // Smart processing based on options
      if (smartOptions.removeQueryParams) {
        try {
          const urlObj = new URL(trimmedUrl);
          urlObj.search = "";
          finalUrl = urlObj.toString();
        } catch (e) {
          finalUrl = trimmedUrl;
        }
      }

      if (smartOptions.trackingParams) {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl = `${finalUrl}${separator}utm_source=bulk&utm_medium=shortener`;
      }

      const alias = smartOptions.autoAlias
        ? generateSmartSlug(trimmedUrl)
        : `link-${index + 1}`;
      const shortUrl = `https://${smartOptions.customDomain}/${alias}`;

      setTimeout(() => setProcessedCount((prev) => prev + 1), index * 50);

      return {
        id: Date.now() + index,
        original: trimmedUrl,
        processed: finalUrl,
        short: shortUrl,
        alias: alias,
        domain: getDomain(trimmedUrl),
        clicks: 0,
        status: isValidUrl(trimmedUrl) ? ("success" as const) : ("error" as const),
      };
    });

    setUrls(processed);

    setTimeout(() => {
      setIsProcessing(false);
    }, urlLines.length * 50 + 500);
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "invalid";
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "copied",
      description: "link copied to clipboard",
    });
  };

  const exportUrls = (format: "txt" | "csv" | "json") => {
    let content = "";

    if (format === "csv") {
      content = "Original URL,Short URL,Alias,Status\n";
      urls.forEach((url) => {
        content += `"${url.original}","${url.short}","${url.alias}","${url.status}"\n`;
      });
    } else if (format === "json") {
      content = JSON.stringify(urls, null, 2);
    } else {
      urls.forEach((url) => {
        content += `${url.short}\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulk-urls-${Date.now()}.${format === "csv" ? "csv" : format === "json" ? "json" : "txt"}`;
    a.click();
  };

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

  const groupedUrls = smartOptions.groupByDomain
    ? urls.reduce((acc, url) => {
        const domain = url.domain;
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(url);
        return acc;
      }, {} as Record<string, ProcessedURL[]>)
    : { all: urls };

  const stats = {
    total: urls.length,
    successful: urls.filter((u) => u.status === "success").length,
    domains: new Set(urls.map((u) => u.domain)).size,
    totalClicks: urls.reduce((sum, u) => sum + u.clicks, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-large-title font-display font-bold text-label mb-2">
          url shortener
        </h2>
        <p className="text-body-apple text-secondary-label">
          smart batch processing with pattern detection
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="smart" className="gap-2">
                <Sparkles className="h-4 w-4" />
                smart
              </TabsTrigger>
              <TabsTrigger value="manual">manual</TabsTrigger>
            </TabsList>

            <TabsContent value="smart" className="space-y-4 mt-4">
              {/* Smart Options */}
              <Card variant="grouped">
                <CardHeader>
                  <CardTitle className="text-title-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    smart processing options
                  </CardTitle>
                  <CardDescription>
                    configure automatic URL optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="auto-alias">auto-generate smart aliases</Label>
                    </div>
                    <Switch
                      id="auto-alias"
                      checked={smartOptions.autoAlias}
                      onCheckedChange={(checked) =>
                        setSmartOptions({ ...smartOptions, autoAlias: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="tracking-params">add UTM tracking</Label>
                    </div>
                    <Switch
                      id="tracking-params"
                      checked={smartOptions.trackingParams}
                      onCheckedChange={(checked) =>
                        setSmartOptions({ ...smartOptions, trackingParams: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="remove-query">clean query parameters</Label>
                    </div>
                    <Switch
                      id="remove-query"
                      checked={smartOptions.removeQueryParams}
                      onCheckedChange={(checked) =>
                        setSmartOptions({ ...smartOptions, removeQueryParams: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-secondary-label" />
                      <Label htmlFor="group-domain">group by domain</Label>
                    </div>
                    <Switch
                      id="group-domain"
                      checked={smartOptions.groupByDomain}
                      onCheckedChange={(checked) =>
                        setSmartOptions({ ...smartOptions, groupByDomain: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">custom domain</Label>
                    <Select
                      value={smartOptions.customDomain}
                      onValueChange={(value) =>
                        setSmartOptions({ ...smartOptions, customDomain: value })
                      }
                    >
                      <SelectTrigger id="domain">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDomains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <Card variant="grouped">
                <CardHeader>
                  <CardTitle className="text-title-3">manual processing</CardTitle>
                  <CardDescription>
                    paste URLs without automatic optimization
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>

          {/* URL Input */}
          <Card variant="grouped">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-title-3">paste URLs</CardTitle>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      import
                    </span>
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="paste your URLs here, one per line...

https://example.com/page1
https://example.com/page2
https://another-site.com/article"
                className="min-h-[240px] font-mono text-sm"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-label">
                  {bulkInput.split("\n").filter((line) => line.trim()).length} URLs detected
                </span>
                <Button
                  onClick={processUrls}
                  disabled={!bulkInput.trim() || isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      processing {processedCount}/{bulkInput.split("\n").filter((line) => line.trim()).length}
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      process URLs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <Card variant="grouped">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-title-3 flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  shortened URLs
                </CardTitle>
                {urls.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-sm font-medium bg-primary/10 text-primary">
                    {urls.length}
                  </span>
                )}
              </div>

              {urls.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportUrls("txt")}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    TXT
                  </Button>
                  <Button
                    onClick={() => exportUrls("csv")}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    CSV
                  </Button>
                  <Button
                    onClick={() => exportUrls("json")}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    JSON
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {urls.length === 0 ? (
                <div className="text-center py-12">
                  <Link2 className="h-12 w-12 mx-auto mb-4 text-secondary-label opacity-50" />
                  <p className="text-body-apple text-secondary-label">no URLs processed yet</p>
                  <p className="text-sm text-tertiary-label mt-1">
                    add URLs and click process to get started
                  </p>
                </div>
              ) : (
                Object.entries(groupedUrls).map(([domain, domainUrls]) => (
                  <div key={domain} className="space-y-2">
                    {smartOptions.groupByDomain && domain !== "all" && (
                      <div className="flex items-center gap-2 text-sm text-secondary-label font-mono">
                        <Globe className="h-3 w-3" />
                        {domain}
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">
                          {domainUrls.length}
                        </span>
                      </div>
                    )}

                    {domainUrls.map((url, index) => (
                      <div
                        key={url.id}
                        className={`group p-3 rounded-lg border transition-all ${
                          url.status === "error"
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border hover:border-white/30 bg-card"
                        }`}
                        onMouseEnter={() => setHoveredUrl(url.id)}
                        onMouseLeave={() => setHoveredUrl(null)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              {url.status === "error" ? (
                                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                              ) : (
                                <Check className="h-4 w-4 text-system-green flex-shrink-0" />
                              )}
                              <p className="text-sm text-secondary-label truncate">{url.original}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <ChevronRight className="h-4 w-4 text-tertiary-label" />
                              <p className="font-mono text-sm truncate text-primary">{url.short}</p>
                              <button
                                onClick={() => copyToClipboard(url.short)}
                                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
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
      {urls.length > 0 && (
        <Card variant="grouped">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-secondary-label">total URLs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-system-green">
                  {stats.successful}
                </div>
                <div className="text-sm text-secondary-label">successful</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">{stats.domains}</div>
                <div className="text-sm text-secondary-label">domains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-system-orange">
                  {stats.totalClicks}
                </div>
                <div className="text-sm text-secondary-label">total clicks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
