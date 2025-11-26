import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepIndicator } from "./wizard/StepIndicator";
import { MethodSelection } from "./wizard/MethodSelection";
import { ConfigurationStep } from "./wizard/ConfigurationStep";
import { UploadPreviewStep } from "./wizard/UploadPreviewStep";
import { ReviewCreateStep } from "./wizard/ReviewCreateStep";
import { HistoryTab } from "./tabs/HistoryTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { TemplatesTab } from "./tabs/TemplatesTab";
import { TeamTab } from "./tabs/TeamTab";
import { useBulkValidation } from "@/hooks/useBulkValidation";
import { useEnhancedBatchProcessor } from "@/hooks/useEnhancedBatchProcessor";
import { useBulkLinkPreview } from "@/hooks/useBulkLinkPreview";
import { useBulkSecurityScan } from "@/hooks/useBulkSecurityScan";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { generateSlugFromTitle } from "@/lib/slugify";
import { BulkQRGenerator } from "./BulkQRGenerator";

interface BulkUploadTabsProps {
  workspaceId: string;
}

const WIZARD_STEPS = ["method", "configure", "upload", "review"];
const STEP_LABELS = ["choose method", "configuration", "upload & preview", "review & create"];

export const BulkUploadTabs = ({ workspaceId }: BulkUploadTabsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("upload");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [manualInput, setManualInput] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("utm.click");
  const [utmDefaults, setUtmDefaults] = useState<Record<string, string>>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });
  const [folderId, setFolderId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showQRGenerator, setShowQRGenerator] = useState(false);

  const { validations, validateURLs, updateValidation, getStats } = useBulkValidation();
  const { state, results, processURLs, reset } = useEnhancedBatchProcessor(workspaceId, 10);
  const { previews } = useBulkLinkPreview(urls);
  const { scanResults, scanMultipleURLs, getSecurityStats } = useBulkSecurityScan();

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setSelectedDomain(template.domain);
    setUtmDefaults(template.utm_defaults || {});
    setCurrentStep(2); // Skip to configuration
  };

  const handleStartFresh = () => {
    setSelectedTemplate(null);
    setCurrentStep(2);
  };

  const handleFileContent = useCallback(
    async (content: string) => {
      const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
      
      if (lines[0]?.includes(',')) {
        const [header, ...rows] = lines;
        const headers = header.split(',').map(h => h.trim().toLowerCase());
        const urlIndex = headers.findIndex(h => h.includes('url'));
        const parsedUrls = rows.map(row => {
          const cells = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          return cells[urlIndex] || row;
        });
        
        setUrls(parsedUrls);
        setManualInput(parsedUrls.join('\n'));
        await validateURLs(parsedUrls, workspaceId);
      } else {
        setUrls(lines);
        setManualInput(lines.join('\n'));
        await validateURLs(lines, workspaceId);
      }
    },
    [validateURLs, workspaceId]
  );

  const handleManualInput = useCallback(
    async (value: string) => {
      setManualInput(value);
      const lines = value.split('\n').map(line => line.trim()).filter(Boolean);
      setUrls(lines);
      if (lines.length > 0) {
        const validated = await validateURLs(lines, workspaceId);
        const validUrls = validated.filter(v => v.isValid).map(v => v.url);
        if (validUrls.length > 0) {
          scanMultipleURLs(validUrls);
        }
      }
    },
    [validateURLs, scanMultipleURLs, workspaceId]
  );

  const handleRemoveURL = useCallback(
    (index: number) => {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      setManualInput(newUrls.join('\n'));
      if (newUrls.length > 0) {
        validateURLs(newUrls, workspaceId);
      }
    },
    [urls, validateURLs, workspaceId]
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

    const links = validations
      .filter(v => v.isValid && !v.isDuplicate)
      .map((v, index) => {
        const autoSlug = generateSlugFromTitle(v.domain || `link-${index + 1}`);
        return {
          destination_url: v.url,
          title: v.title || `bulk link ${index + 1}`,
          slug: v.slug || `${autoSlug}-${index + 1}`,
          utm_source: v.utm_source || utmDefaults.utm_source,
          utm_medium: v.utm_medium || utmDefaults.utm_medium,
          utm_campaign: v.utm_campaign || utmDefaults.utm_campaign,
          utm_term: v.utm_term || utmDefaults.utm_term,
          utm_content: v.utm_content || utmDefaults.utm_content,
          status: 'active',
        };
      });

    try {
      await processURLs(links, selectedDomain, folderId, tags);
      queryClient.invalidateQueries({ queryKey: ["links"] });
      
      const successCount = results.filter(r => r.success).length;
      toast({
        title: "bulk upload complete",
        description: `${successCount} of ${links.length} links created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "processing error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [validations, getStats, processURLs, selectedDomain, folderId, tags, utmDefaults, queryClient, results, toast]);

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

  const canProceedToNext = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return selectedDomain !== "";
    if (currentStep === 3) return urls.length > 0 && getStats().valid > 0;
    return false;
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stats = getStats();
  const securityStats = getSecurityStats();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="upload">upload</TabsTrigger>
          <TabsTrigger value="history">history</TabsTrigger>
          <TabsTrigger value="analytics">analytics</TabsTrigger>
          <TabsTrigger value="templates">templates</TabsTrigger>
          <TabsTrigger value="team">team</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <StepIndicator currentStep={currentStep} totalSteps={4} steps={STEP_LABELS} />

          {currentStep === 1 && (
            <MethodSelection
              workspaceId={workspaceId}
              onUseTemplate={handleTemplateSelect}
              onStartFresh={handleStartFresh}
            />
          )}

          {currentStep === 2 && (
            <ConfigurationStep
              workspaceId={workspaceId}
              templateName={selectedTemplate?.name}
              selectedDomain={selectedDomain}
              onDomainChange={setSelectedDomain}
              utmDefaults={utmDefaults}
              onUtmChange={(field, value) => setUtmDefaults(prev => ({ ...prev, [field]: value }))}
              folderId={folderId}
              onFolderChange={setFolderId}
              tags={tags}
              onTagsChange={setTags}
              lockedFields={selectedTemplate ? Object.keys(selectedTemplate.utm_defaults || {}) : []}
            />
          )}

          {currentStep === 3 && (
            <UploadPreviewStep
              workspaceId={workspaceId}
              selectedDomain={selectedDomain}
              manualInput={manualInput}
              onManualInputChange={handleManualInput}
              onFileContent={handleFileContent}
              validations={validations}
              previews={previews}
              scanResults={scanResults}
              onUpdateValidation={updateValidation}
              onRemoveURL={handleRemoveURL}
              securityStats={securityStats}
            />
          )}

          {currentStep === 4 && (
            <ReviewCreateStep
              selectedDomain={selectedDomain}
              utmDefaults={utmDefaults}
              folderId={folderId}
              tags={tags}
              urlCount={stats.valid}
              isProcessing={state.stage !== 'idle' && state.stage !== 'complete'}
              processingState={state}
              onProcess={handleProcess}
              results={results}
              onExportResults={exportResults}
              onGenerateQR={() => setShowQRGenerator(true)}
            />
          )}

          <div className="flex items-center justify-between">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                back
              </Button>
            )}
            {currentStep < 4 && currentStep > 1 && (
              <Button onClick={handleNext} disabled={!canProceedToNext()} className="ml-auto">
                next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="team">
          <TeamTab workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>

      {showQRGenerator && results.length > 0 && (
        <BulkQRGenerator
          open={showQRGenerator}
          onOpenChange={setShowQRGenerator}
          links={results.filter(r => r.success).map(r => ({
            id: r.linkId || '',
            short_url: r.shortUrl || '',
            slug: r.slug || '',
          }))}
        />
      )}
    </div>
  );
};
