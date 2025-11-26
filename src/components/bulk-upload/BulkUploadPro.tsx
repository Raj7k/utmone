import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layers, CheckCircle2, XCircle, AlertTriangle, Download, Upload, QrCode, Clock, RefreshCw, X as XIcon } from "lucide-react";
import { DragDropUploader } from "./DragDropUploader";
import { URLPreviewTable } from "./URLPreviewTable";
import { ProcessingProgress } from "./ProcessingProgress";
import { BulkSecuritySummary } from "./BulkSecuritySummary";
import { useBulkValidation } from "@/hooks/useBulkValidation";
import { BulkTemplateSelector } from "./BulkTemplateSelector";
import { SaveBulkTemplateDialog } from "./SaveBulkTemplateDialog";
import { useEnhancedBatchProcessor } from "@/hooks/useEnhancedBatchProcessor";
import { useBulkLinkPreview } from "@/hooks/useBulkLinkPreview";
import { useBulkSecurityScan } from "@/hooks/useBulkSecurityScan";
import { BulkFolderSelector } from "./BulkFolderSelector";
import { BulkTagInput } from "./BulkTagInput";
import { BulkQRGenerator } from "./BulkQRGenerator";
import { UTMTemplateManager } from "./UTMTemplateManager";
import { BulkLinkSettings, type BulkLinkSettingsData } from "./BulkLinkSettings";
import { UTMValidationRules, type UTMValidationRule } from "./UTMValidationRules";
import { ScheduleSettings, type ScheduleData } from "./ScheduleSettings";
import { ScheduledLinksManager } from "./ScheduledLinksManager";
import { BulkUploadHistory } from "./BulkUploadHistory";
import { BulkUploadAnalytics } from "./BulkUploadAnalytics";
import { BatchLinkOperations } from "./BatchLinkOperations";
import { ErrorRecovery } from "./ErrorRecovery";
import { ValidationReport } from "./ValidationReport";
import { NotificationSettings, type NotificationPreferences } from "./NotificationSettings";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { BulkUploadComments } from "./BulkUploadComments";
import { BulkUploadApprovalWorkflow } from "./BulkUploadApprovalWorkflow";
import { BulkUploadActivityLog } from "./BulkUploadActivityLog";
import { SharedTemplatesManager } from "./SharedTemplatesManager";
import { useBulkUploadPersistence } from "@/hooks/useBulkUploadPersistence";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateSlugFromTitle } from "@/lib/slugify";
import type { BatchResult } from "@/hooks/useBatchProcessor";

interface BulkUploadProProps {
  workspaceId: string;
}

export const BulkUploadPro = ({ workspaceId }: BulkUploadProProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("utm.click");
  const [manualInput, setManualInput] = useState("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [linkSettings, setLinkSettings] = useState<BulkLinkSettingsData>({
    redirect_type: "302",
  });
  const [validationRules, setValidationRules] = useState<UTMValidationRule[]>([]);
  const [schedule, setSchedule] = useState<ScheduleData>({
    enabled: false,
    activationDate: null,
    activationTime: "09:00",
  });
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [savedProgress, setSavedProgress] = useState<any>(null);
  const [utmDefaults, setUtmDefaults] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });
  const [smartOptions, setSmartOptions] = useState({
    autoAlias: false,
    utmTracking: false,
    cleanQueryParams: false,
    groupByDomain: false,
  });

  const { validations, validateURLs, updateValidation, getStats } = useBulkValidation();
  const { state, results, processURLs, retryFailed, reset } = useEnhancedBatchProcessor(workspaceId, 10);
  const [showErrorRecovery, setShowErrorRecovery] = useState(false);
  const [processingStartTime, setProcessingStartTime] = useState(0);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    email: true,
    webhook: false,
    inApp: true,
  });
  const { previews, isLoading: previewsLoading } = useBulkLinkPreview(urls);
  const { scanResults, scanMultipleURLs, getSecurityStats } = useBulkSecurityScan();
  const persistence = useBulkUploadPersistence();

  // Check for unfinished uploads on mount
  useEffect(() => {
    const saved = persistence.loadProgress();
    if (saved && persistence.hasUnfinishedUpload()) {
      setSavedProgress(saved);
      setShowResumeBanner(true);
    }
  }, []);

  // Auto-save progress when validations change
  useEffect(() => {
    if (validations.length > 0 && state.stage !== "complete") {
      persistence.saveProgress({
        urls,
        validations,
        selectedDomain,
        utmDefaults,
        smartOptions,
        folderId,
        tags,
        processedCount: state.processedCount,
        results,
      });
    }
  }, [validations, state.stage, state.processedCount, urls, selectedDomain, utmDefaults, smartOptions, folderId, tags, results]);

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

  const handleFileContent = useCallback(
    async (content: string) => {
      // Check if CSV with headers
      const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
      
      if (lines[0]?.includes(',')) {
        // Parse as CSV
        const [header, ...rows] = lines;
        const headers = header.split(',').map(h => h.trim().toLowerCase());
        
        const urlIndex = headers.findIndex(h => h.includes('url'));
        const slugIndex = headers.findIndex(h => h.includes('slug'));
        const sourceIndex = headers.findIndex(h => h.includes('source'));
        const mediumIndex = headers.findIndex(h => h.includes('medium'));
        const campaignIndex = headers.findIndex(h => h.includes('campaign'));
        const termIndex = headers.findIndex(h => h.includes('term'));
        const contentIndex = headers.findIndex(h => h.includes('content'));
        
        const parsedUrls = rows.map(row => {
          const cells = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          return cells[urlIndex] || row;
        });
        
        setUrls(parsedUrls);
        setManualInput(parsedUrls.join('\n'));
        await validateURLs(parsedUrls, workspaceId);
        
        // Apply CSV data to validations
        rows.forEach((row, index) => {
          const cells = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          updateValidation(index, {
            slug: slugIndex >= 0 ? cells[slugIndex] : undefined,
            utm_source: sourceIndex >= 0 ? cells[sourceIndex] : undefined,
            utm_medium: mediumIndex >= 0 ? cells[mediumIndex] : undefined,
            utm_campaign: campaignIndex >= 0 ? cells[campaignIndex] : undefined,
            utm_term: termIndex >= 0 ? cells[termIndex] : undefined,
            utm_content: contentIndex >= 0 ? cells[contentIndex] : undefined,
          });
        });
      } else {
        // Plain text URLs
        setUrls(lines);
        setManualInput(lines.join('\n'));
        await validateURLs(lines, workspaceId);
      }
    },
    [validateURLs, updateValidation, workspaceId]
  );

  const handleManualInput = useCallback(
    async (value: string) => {
      setManualInput(value);
      const lines = value.split('\n').map(line => line.trim()).filter(Boolean);
      setUrls(lines);
      if (lines.length > 0) {
        const validated = await validateURLs(lines, workspaceId);
        // Trigger security scans for valid URLs
        const validUrls = validated.filter(v => v.isValid).map(v => v.url);
        if (validUrls.length > 0) {
          scanMultipleURLs(validUrls);
        }
      }
    },
    [validateURLs, scanMultipleURLs, workspaceId]
  );

  const handleTemplateSelect = (template: any) => {
    if (!template) return;

    setSelectedDomain(template.domain);
    setUtmDefaults(template.utm_defaults || {});
    setSmartOptions(template.smart_options || {});
  };

  const handleTemplateRefresh = () => {
    // Trigger re-fetch of templates
  };

  const handleResumeProgress = useCallback(() => {
    if (!savedProgress) return;

    setUrls(savedProgress.urls);
    setManualInput(savedProgress.urls.join('\n'));
    setSelectedDomain(savedProgress.selectedDomain);
    setUtmDefaults(savedProgress.utmDefaults);
    setSmartOptions(savedProgress.smartOptions);
    setFolderId(savedProgress.folderId);
    setTags(savedProgress.tags);
    
    // Re-validate URLs
    validateURLs(savedProgress.urls, workspaceId);
    
    setShowResumeBanner(false);
    
    toast({
      title: "progress restored",
      description: "your previous upload has been restored",
    });
  }, [savedProgress, validateURLs, workspaceId, toast]);

  const handleDiscardProgress = useCallback(() => {
    persistence.clearProgress();
    setShowResumeBanner(false);
    setSavedProgress(null);
    
    toast({
      title: "progress cleared",
      description: "previous upload data has been discarded",
    });
  }, [persistence, toast]);

  const handleRemoveURL = useCallback(
    (index: number) => {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      setManualInput(newUrls.join('\n'));
      if (newUrls.length > 0) {
        validateURLs(newUrls);
      }
    },
    [urls, validateURLs]
  );

  const handleProcess = useCallback(async () => {
    const stats = getStats();
    
    if (stats.invalid > 0) {
      toast({
        title: "validation errors",
        description: `${stats.invalid} invalid URLs. please fix before processing`,
        variant: "destructive",
      });
      return;
    }

    // Validate UTM parameters against rules
    for (const validation of validations) {
      for (const rule of validationRules) {
        const value = validation[rule.parameter] || "";
        if (rule.required && !value) {
          toast({
            title: "validation error",
            description: `${rule.parameter} is required for all links`,
            variant: "destructive",
          });
          return;
        }
        if (rule.pattern && value) {
          try {
            const regex = new RegExp(rule.pattern);
            if (!regex.test(value)) {
              toast({
                title: "validation error",
                description: rule.errorMessage || `${rule.parameter} does not match required pattern`,
                variant: "destructive",
              });
              return;
            }
          } catch (e) {
            toast({
              title: "validation error",
              description: `invalid regex pattern for ${rule.parameter}`,
              variant: "destructive",
            });
            return;
          }
        }
        if (rule.allowedValues && rule.allowedValues.length > 0 && value) {
          if (!rule.allowedValues.includes(value)) {
            toast({
              title: "validation error",
              description: `${rule.parameter} must be one of: ${rule.allowedValues.join(", ")}`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    // Calculate activation timestamp if scheduling is enabled
    let activationAt: string | undefined;
    let status: 'active' | 'scheduled' = 'active';
    if (schedule.enabled && schedule.activationDate && schedule.activationTime) {
      const [hours, minutes] = schedule.activationTime.split(':').map(Number);
      const timestamp = new Date(schedule.activationDate);
      timestamp.setHours(hours, minutes, 0, 0);
      activationAt = timestamp.toISOString();
      status = 'scheduled';
    }

    // Prepare links for creation with custom slugs, UTM parameters, and advanced settings
    const links = validations
      .filter(v => v.isValid && !v.isDuplicate)
      .map((v, index) => {
        const autoSlug = generateSlugFromTitle(v.domain || `link-${index + 1}`);
        return {
          destination_url: v.url,
          title: v.title || `Bulk Link ${index + 1}`,
          slug: v.slug || `${autoSlug}-${index + 1}`,
          utm_source: v.utm_source,
          utm_medium: v.utm_medium,
          utm_campaign: v.utm_campaign,
          utm_term: v.utm_term,
          utm_content: v.utm_content,
          status,
          activation_at: activationAt,
          ...linkSettings,
        };
      });

    setProcessingStartTime(Date.now());
    
    try {
      const batchResults = await processURLs(links, selectedDomain, folderId, tags);
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      
      // Clear persistence on successful completion
      persistence.clearProgress();
      
      const successCount = batchResults.filter(r => r.success).length;
      const failedResultsCount = batchResults.filter(r => !r.success).length;
      
      // Send notifications
      const notificationChannels: ('email' | 'webhook' | 'in_app')[] = [];
      if (notificationPreferences.email) notificationChannels.push('email');
      if (notificationPreferences.webhook) notificationChannels.push('webhook');
      if (notificationPreferences.inApp) notificationChannels.push('in_app');
      
      if (notificationChannels.length > 0) {
        await supabase.functions.invoke('notify-bulk-upload-complete', {
          body: {
            workspace_id: workspaceId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            total_links: links.length,
            successful: successCount,
            failed: failedResultsCount,
            notification_channels: notificationChannels,
          },
        });
      }
      
      if (failedResultsCount > 0) {
        setShowErrorRecovery(true);
        toast({
          title: "Upload completed with errors",
          description: `${successCount} succeeded, ${failedResultsCount} failed`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Bulk upload complete",
          description: `${successCount} of ${links.length} links created successfully`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Processing error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingStartTime(0);
    }
  }, [validations, getStats, processURLs, selectedDomain, folderId, tags, queryClient, results, toast, notificationPreferences, workspaceId]);

  const handleRetryFailed = async (urls: string[]) => {
    await retryFailed(urls, selectedDomain, folderId, tags);
  };

  const exportResults = useCallback(() => {
    const csvContent = [
      'Original URL,Short URL,Slug,Status,Error',
      ...results.map(r => 
        `"${r.url}","${r.shortUrl || ''}","${r.slug || ''}","${r.success ? 'success' : 'failed'}","${r.error || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-links-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const stats = getStats();
  const securityStats = getSecurityStats();
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;

  return (
    <div className="space-y-6">
      {/* Resume Progress Banner */}
      {showResumeBanner && savedProgress && (
        <Alert className="border-primary/50 bg-primary/5">
          <Clock className="h-4 w-4 text-primary" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">unfinished upload found</p>
              <p className="text-sm text-muted-foreground mt-1">
                you have an upload from {new Date(savedProgress.savedAt).toLocaleDateString()} with {savedProgress.urls.length} URLs
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResumeProgress}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                resume
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardProgress}
              >
                <XIcon className="h-4 w-4 mr-2" />
                discard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Input Section */}
      {state.stage === "idle" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-title-2">domain selection</CardTitle>
              <CardDescription>
                Choose a verified custom domain for your short links or load a saved template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workspaceId && (
                <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
                  <Label className="text-sm font-medium">saved templates</Label>
                  <div className="flex items-center gap-2">
                    <BulkTemplateSelector
                      workspaceId={workspaceId}
                      onTemplateSelect={handleTemplateSelect}
                    />
                    <SaveBulkTemplateDialog
                      workspaceId={workspaceId}
                      domain={selectedDomain}
                      utmDefaults={utmDefaults}
                      smartOptions={smartOptions}
                      onTemplateSaved={handleTemplateRefresh}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="domain">custom domain</Label>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger id="domain">
                    <SelectValue />
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
            </CardContent>
          </Card>

          {/* Organization Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-title-2">organization</CardTitle>
              <CardDescription>assign folder and tags to all links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <BulkFolderSelector value={folderId} onChange={setFolderId} />
              <BulkTagInput
                value={tags}
                onChange={setTags}
              />
            </div>
          </CardContent>
        </Card>

        {/* UTM Template Manager */}
        {workspaceId && (
          <UTMTemplateManager
            workspaceId={workspaceId}
            onApplyTemplate={(template) => {
              setUtmDefaults(template);
              toast({
                title: "template applied",
                description: "UTM template has been applied to all links",
              });
            }}
          />
        )}

        {/* Advanced Link Settings */}
        <BulkLinkSettings settings={linkSettings} onChange={setLinkSettings} />

        {/* UTM Validation Rules */}
        <UTMValidationRules rules={validationRules} onChange={setValidationRules} />

        {/* Schedule Settings */}
        <ScheduleSettings schedule={schedule} onChange={setSchedule} />

        {/* Notification Settings */}
        <NotificationSettings
          preferences={notificationPreferences}
          onPreferencesChange={setNotificationPreferences}
          hasWebhookConfigured={false}
        />

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-title-2">upload URLs</CardTitle>
              <CardDescription>
                drag and drop or paste URLs • 
                <a 
                  href="/bulk-upload-template.csv" 
                  download 
                  className="text-primary hover:underline ml-1"
                >
                  download CSV template
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {urls.length === 0 ? (
                <DragDropUploader onFileSelect={handleFileContent} />
              ) : (
                <div className="space-y-4">
                  <Textarea
                    value={manualInput}
                    onChange={(e) => handleManualInput(e.target.value)}
                    placeholder="https://example.com/page1&#10;https://example.com/page2"
                    className="min-h-[120px] font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-label">
                      {stats.total} URLs • {stats.valid} valid • {stats.duplicates} duplicates • {stats.invalid} invalid
                    </span>
                    <Button variant="outline" size="sm" onClick={() => {
                      setUrls([]);
                      setManualInput('');
                    }}>
                      clear all
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {validations.length > 0 && (
            <>
              {securityStats.total > 0 && (
                <BulkSecuritySummary
                  httpsCount={securityStats.httpsCount}
                  safeCount={securityStats.safe}
                  threatsCount={securityStats.threats}
                  total={securityStats.total}
                />
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-title-2">preview & validate</CardTitle>
                  <CardDescription>review URLs before creating</CardDescription>
                </CardHeader>
                <CardContent>
                  <URLPreviewTable 
                    validations={validations} 
                    previews={previews}
                    scanResults={scanResults}
                    selectedDomain={selectedDomain}
                    workspaceId={workspaceId}
                    onRemove={handleRemoveURL}
                    onUpdateValidation={updateValidation}
                  />
                  <div className="mt-6">
                    <Button
                      onClick={handleProcess}
                      disabled={stats.valid === 0}
                      className="w-full"
                      size="lg"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      create {stats.valid} links
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {/* Processing Section */}
      {(state.stage === "parsing" || state.stage === "validating" || state.stage === "creating") && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-title-2">processing links</CardTitle>
              <CardDescription>creating your short links…</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessingProgress
                stage={state.stage}
                currentBatch={state.currentBatch}
                totalBatches={state.totalBatches}
                processedCount={state.processedCount}
                totalCount={state.totalCount}
              />
            </CardContent>
          </Card>

          {processingStartTime > 0 && (
            <PerformanceMonitor
              currentBatch={state.currentBatch}
              totalBatches={state.totalBatches}
              processedCount={state.processedCount}
              totalCount={state.totalCount}
              successCount={results.filter(r => r.success).length}
              startTime={processingStartTime}
            />
          )}
        </>
      )}

      {/* Results Section */}
      {state.stage === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-title-2">upload complete</CardTitle>
            <CardDescription>your bulk upload has finished</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-display font-bold">{stats.total}</p>
                  <p className="text-sm text-secondary-label">total processed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-system-green" />
                <div>
                  <p className="text-2xl font-display font-bold">{successCount}</p>
                  <p className="text-sm text-secondary-label">successful</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-display font-bold">{failedCount}</p>
                  <p className="text-sm text-secondary-label">failed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-system-orange" />
                <div>
                  <p className="text-2xl font-display font-bold">{stats.duplicates}</p>
                  <p className="text-sm text-secondary-label">duplicates skipped</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={exportResults} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                export results
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQRGenerator(true)}
                disabled={successCount === 0}
                className="flex-1"
              >
                <QrCode className="h-4 w-4 mr-2" />
                generate QR codes
              </Button>
              <Button onClick={() => {
                reset();
                setUrls([]);
                setManualInput('');
              }} className="flex-1">
                create more links
              </Button>
            </div>
          </CardContent>
        </Card>
      )}



      <BulkQRGenerator
        open={showQRGenerator}
        onOpenChange={setShowQRGenerator}
        links={results
          .filter(r => r.success && r.shortUrl && r.linkId)
          .map(r => ({
            id: r.linkId || '',
            short_url: r.shortUrl || '',
            slug: r.slug || '',
          }))}
      />

      {/* Validation Report */}
      {validations.length > 0 && state.stage === "idle" && (
        <ValidationReport 
          validations={validations} 
          stats={getStats()} 
        />
      )}

      {/* Error Recovery */}
      {showErrorRecovery && results.some(r => !r.success) && (
        <ErrorRecovery
          failedResults={results.filter(r => !r.success)}
          onRetry={handleRetryFailed}
          onDismiss={() => setShowErrorRecovery(false)}
        />
      )}

      {/* Analytics & Management Section */}
      {state.stage === "idle" && (
        <div className="space-y-6 mt-8">
          <div className="border-t pt-8">
            <h2 className="text-2xl font-display font-semibold mb-6">team collaboration</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Comments on bulk uploads */}
              {results.length > 0 && (
                <BulkUploadComments bulkUploadId={`bulk-${Date.now()}`} />
              )}
              
              {/* Approval Workflow */}
              <BulkUploadApprovalWorkflow workspaceId={workspaceId} />
              
              {/* Activity Log */}
              {results.length > 0 && (
                <BulkUploadActivityLog bulkUploadId={`bulk-${Date.now()}`} />
              )}
              
              {/* Shared Templates */}
              <SharedTemplatesManager workspaceId={workspaceId} />
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-display font-semibold mb-6">analytics & management</h2>
            
            <div className="grid gap-6">
              {/* Scheduled Links Manager */}
              <ScheduledLinksManager workspaceId={workspaceId} />
              
              {/* Bulk Upload Analytics */}
              <BulkUploadAnalytics workspaceId={workspaceId} />
              
              {/* Bulk Upload History */}
              <BulkUploadHistory workspaceId={workspaceId} />
              
              {/* Batch Link Operations */}
              <BatchLinkOperations workspaceId={workspaceId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
