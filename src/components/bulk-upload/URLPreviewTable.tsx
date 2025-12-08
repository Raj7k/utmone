import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Loader2 } from "lucide-react";
import { ValidationBadge } from "./ValidationBadge";
import { TrustBadge } from "@/components/TrustBadge";
import { LinkPreviewCard } from "@/components/LinkPreviewCard";
import { EditableSlugCell } from "./EditableSlugCell";
import { BulkUTMEditor } from "./BulkUTMEditor";
import type { URLValidation } from "@/hooks/useBulkValidation";
import type { LinkPreview } from "@/hooks/useBulkLinkPreview";
import type { SecurityScanResult } from "@/hooks/useBulkSecurityScan";

interface URLPreviewTableProps {
  validations: URLValidation[];
  previews: Map<string, LinkPreview>;
  scanResults: Map<string, SecurityScanResult>;
  selectedDomain: string;
  workspaceId: string;
  onRemove: (index: number) => void;
  onUpdateValidation: (index: number, updates: Partial<URLValidation>) => void;
}

export const URLPreviewTable = ({ 
  validations, 
  previews, 
  scanResults, 
  selectedDomain,
  workspaceId,
  onRemove,
  onUpdateValidation,
}: URLPreviewTableProps) => {
  if (validations.length === 0) return null;

  const handleCopyUTMToAll = (index: number) => {
    const sourceUTM = validations[index];
    validations.forEach((_, i) => {
      if (i !== index) {
        onUpdateValidation(i, {
          utm_source: sourceUTM.utm_source,
          utm_medium: sourceUTM.utm_medium,
          utm_campaign: sourceUTM.utm_campaign,
          utm_term: sourceUTM.utm_term,
          utm_content: sourceUTM.utm_content,
        });
      }
    });
  };

  const getSecurityBadge = (url: string, preview: LinkPreview | undefined, scanResult: SecurityScanResult | undefined) => {
    // Show security scan status
    if (scanResult?.isScanning) {
      return (
        <div className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" style={{ color: 'rgba(255,255,255,0.5)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>scanning…</span>
        </div>
      );
    }

    if (scanResult?.scanned) {
      if (scanResult.is_safe === false) {
        return <TrustBadge variant="threats-detected" size="sm" />;
      } else if (scanResult.is_safe === true) {
        return <TrustBadge variant="scanned-safe" size="sm" />;
      }
    }

    // Show SSL status
    if (preview?.is_ssl_secure === true || url.startsWith('https://')) {
      return <TrustBadge variant="ssl-secure" size="sm" />;
    }

    return null;
  };

  return (
    <div className="border rounded-xl overflow-hidden border-white/10">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-zinc-900/95">
            <TableRow>
              <TableHead className="font-display font-semibold">preview</TableHead>
              <TableHead className="font-display font-semibold">custom slug</TableHead>
              <TableHead className="font-display font-semibold">utm parameters</TableHead>
              <TableHead className="font-display font-semibold">security</TableHead>
              <TableHead className="font-display font-semibold">validation</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validations.map((validation, index) => {
              const preview = previews.get(validation.url);
              const scanResult = scanResults.get(validation.url);
              
              return (
                <TableRow key={index}>
                  <TableCell className="w-[280px]">
                    {preview?.isLoading ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ) : (
                      <LinkPreviewCard 
                        linkId="" 
                        destinationUrl={validation.url}
                      >
                        <div className="flex items-center gap-3 cursor-pointer transition-colors hover:opacity-80">
                          {preview?.favicon_url ? (
                            <img 
                              src={preview.favicon_url} 
                              alt="" 
                              className="h-8 w-8 rounded object-cover flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded flex items-center justify-center flex-shrink-0 bg-white/10">
                              <span className="text-xs text-white/50">
                                {validation.domain?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {preview?.page_title || validation.domain || 'Unknown'}
                            </p>
                            <p className="text-xs truncate text-white/60">
                              {validation.domain}
                            </p>
                          </div>
                        </div>
                      </LinkPreviewCard>
                    )}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    {validation.isValid && (
                      <EditableSlugCell
                        slug={validation.slug || `link-${index + 1}`}
                        domain={selectedDomain}
                        workspaceId={workspaceId}
                        onChange={(slug, isAvailable) => {
                          onUpdateValidation(index, { slug });
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="w-[250px]">
                    {validation.isValid && (
                      <BulkUTMEditor
                        index={index}
                        utm_source={validation.utm_source}
                        utm_medium={validation.utm_medium}
                        utm_campaign={validation.utm_campaign}
                        utm_term={validation.utm_term}
                        utm_content={validation.utm_content}
                        onChange={(field, value) => {
                          onUpdateValidation(index, { [field]: value });
                        }}
                        onCopyToAll={index === 0 ? () => handleCopyUTMToAll(index) : undefined}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSecurityBadge(validation.url, preview, scanResult)}
                      <TrustBadge variant="utm-verified" size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <ValidationBadge
                        status={
                          !validation.isValid
                            ? "invalid"
                            : validation.isDuplicate
                            ? "duplicate"
                            : "valid"
                        }
                        message={validation.error || undefined}
                      />
                      {validation.existsInDatabase && (
                        <div className="flex items-center gap-1 text-xs text-amber-400/80">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-400/10">
                            <span className="font-medium">exists:</span>
                            <code className="text-amber-400/90">{validation.existingSlug}</code>
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRemove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};