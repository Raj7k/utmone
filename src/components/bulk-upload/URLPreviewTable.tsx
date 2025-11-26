import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Loader2 } from "lucide-react";
import { ValidationBadge } from "./ValidationBadge";
import { TrustBadge } from "@/components/TrustBadge";
import { LinkPreviewCard } from "@/components/LinkPreviewCard";
import type { URLValidation } from "@/hooks/useBulkValidation";
import type { LinkPreview } from "@/hooks/useBulkLinkPreview";
import type { SecurityScanResult } from "@/hooks/useBulkSecurityScan";

interface URLPreviewTableProps {
  validations: URLValidation[];
  previews: Map<string, LinkPreview>;
  scanResults: Map<string, SecurityScanResult>;
  onRemove: (index: number) => void;
}

export const URLPreviewTable = ({ validations, previews, scanResults, onRemove }: URLPreviewTableProps) => {
  if (validations.length === 0) return null;

  const getSecurityBadge = (url: string, preview: LinkPreview | undefined, scanResult: SecurityScanResult | undefined) => {
    // Show security scan status
    if (scanResult?.isScanning) {
      return (
        <div className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">scanning…</span>
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
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="font-display font-semibold">preview</TableHead>
              <TableHead className="font-display font-semibold">original URL</TableHead>
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
                        <div className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
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
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {validation.domain?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {preview?.page_title || validation.domain || 'Unknown'}
                            </p>
                            <p className="text-xs text-secondary-label truncate">
                              {validation.domain}
                            </p>
                          </div>
                        </div>
                      </LinkPreviewCard>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs max-w-md truncate">
                    {validation.url}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSecurityBadge(validation.url, preview, scanResult)}
                      <TrustBadge variant="utm-verified" size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
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
