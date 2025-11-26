import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, QrCode, Download } from "lucide-react";
import { ProcessingProgress } from "../ProcessingProgress";
import { Badge } from "@/components/ui/badge";

interface ReviewCreateStepProps {
  selectedDomain: string;
  utmDefaults: Record<string, string>;
  folderId: string | null;
  tags: string[];
  urlCount: number;
  isProcessing: boolean;
  processingState: any;
  onProcess: () => void;
  results: any[];
  onExportResults: () => void;
  onGenerateQR: () => void;
}

export const ReviewCreateStep = ({
  selectedDomain,
  utmDefaults,
  folderId,
  tags,
  urlCount,
  isProcessing,
  processingState,
  onProcess,
  results,
  onExportResults,
  onGenerateQR,
}: ReviewCreateStepProps) => {
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;
  const hasUtmParams = Object.values(utmDefaults).some(v => v);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>review your configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">domain</p>
              <p className="font-medium">{selectedDomain}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">links to create</p>
              <p className="font-medium">{urlCount} URLs</p>
            </div>
          </div>

          {hasUtmParams && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">UTM parameters</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(utmDefaults).map(([key, value]) => 
                  value ? (
                    <Badge key={key} variant="secondary">
                      {key.replace('utm_', '')}: {value}
                    </Badge>
                  ) : null
                )}
              </div>
            </div>
          )}

          {(folderId || tags.length > 0) && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">organization</p>
              <div className="flex flex-wrap gap-2">
                {folderId && <Badge variant="outline">organized in folder</Badge>}
                {tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!isProcessing && results.length === 0 && (
        <Button 
          onClick={onProcess} 
          size="lg" 
          className="w-full"
        >
          create {urlCount} links
        </Button>
      )}

      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <ProcessingProgress 
              stage={processingState.stage}
              currentBatch={processingState.currentBatch}
              totalBatches={processingState.totalBatches}
              processedCount={processingState.processedCount}
              totalCount={processingState.totalCount}
            />
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <CardTitle>creation complete</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">{successCount}</p>
                <p className="text-sm text-muted-foreground">successful</p>
              </div>
              {failedCount > 0 && (
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">{failedCount}</p>
                  <p className="text-sm text-muted-foreground">failed</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={onExportResults} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                export results
              </Button>
              <Button onClick={onGenerateQR} variant="outline" className="flex-1">
                <QrCode className="h-4 w-4 mr-2" />
                generate qr codes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
