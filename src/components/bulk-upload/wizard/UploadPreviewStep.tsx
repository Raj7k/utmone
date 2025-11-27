import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { DragDropUploader } from "../DragDropUploader";
import { URLPreviewTable } from "../URLPreviewTable";
import { BulkSecuritySummary } from "../BulkSecuritySummary";
import { SectionCard } from "../shared/SectionCard";

interface UploadPreviewStepProps {
  workspaceId: string;
  selectedDomain: string;
  manualInput: string;
  onManualInputChange: (value: string) => void;
  onFileContent: (content: string) => void;
  validations: any[];
  previews: Map<string, any>;
  scanResults: Map<string, any>;
  onUpdateValidation: (index: number, updates: any) => void;
  onRemoveURL: (index: number) => void;
  securityStats: any;
}

export const UploadPreviewStep = ({
  workspaceId,
  selectedDomain,
  manualInput,
  onManualInputChange,
  onFileContent,
  validations,
  previews,
  scanResults,
  onUpdateValidation,
  onRemoveURL,
  securityStats,
}: UploadPreviewStepProps) => {
  const downloadTemplate = () => {
    const template = `url,slug,utm_source,utm_medium,utm_campaign,utm_term,utm_content
https://example.com,example-slug,newsletter,email,spring2024,promo,header-cta
https://example.com/product,product-page,linkedin,social,spring2024,announcement,feed-post`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-upload-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionCard 
        title="upload urls" 
        hint="paste up to 100 URLs at once. automatic validation catches broken links before they go live—saving you from embarrassing dead links."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              download csv template
            </Button>
          </div>

          <DragDropUploader onFileSelect={onFileContent} />

          <div className="relative">
            <Textarea
              placeholder="paste URLs here (one per line)..."
              value={manualInput}
              onChange={(e) => onManualInputChange(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            tip: you can paste URLs directly or upload a CSV file with columns for URL, slug, and UTM parameters
          </p>
        </div>
      </SectionCard>

      {validations.length > 0 && (
        <>
          <SectionCard title="url validation">
            <URLPreviewTable
              validations={validations}
              previews={previews}
              scanResults={scanResults}
              selectedDomain={selectedDomain}
              workspaceId={workspaceId}
              onUpdateValidation={onUpdateValidation}
              onRemove={onRemoveURL}
            />
          </SectionCard>

          <SectionCard title="security scan results">
            <BulkSecuritySummary 
              httpsCount={securityStats.httpsCount}
              safeCount={securityStats.safeCount}
              threatsCount={securityStats.threatsCount}
              total={securityStats.total}
            />
          </SectionCard>
        </>
      )}
    </div>
  );
};
