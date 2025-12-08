import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import type { URLValidation } from "@/hooks/useBulkValidation";

interface ValidationReportProps {
  validations: URLValidation[];
  stats: {
    total: number;
    valid: number;
    duplicates: number;
    invalid: number;
    uniqueDomains: number;
  };
}

export function ValidationReport({ validations, stats }: ValidationReportProps) {
  if (validations.length === 0) {
    return null;
  }

  const hasErrors = stats.invalid > 0 || stats.duplicates > 0;
  const hasWarnings = validations.some(v => v.existsInDatabase);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-title-2">Validation report</CardTitle>
        <CardDescription>
          {stats.valid} valid, {stats.invalid} invalid, {stats.duplicates} duplicates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle2 className="w-3 h-3 text-success" />
            {stats.valid} valid
          </Badge>
          {stats.invalid > 0 && (
            <Badge variant="outline" className="gap-1">
              <XCircle className="w-3 h-3 text-destructive" />
              {stats.invalid} invalid
            </Badge>
          )}
          {stats.duplicates > 0 && (
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="w-3 h-3 text-warning" />
              {stats.duplicates} duplicates
            </Badge>
          )}
          <Badge variant="outline" className="gap-1">
            <Info className="w-3 h-3" />
            {stats.uniqueDomains} unique domains
          </Badge>
        </div>

        {/* Validation alerts */}
        {hasErrors && (
          <Alert variant="destructive">
            <AlertDescription>
              Some URLs have validation errors. Fix these issues before proceeding.
            </AlertDescription>
          </Alert>
        )}

        {hasWarnings && !hasErrors && (
          <Alert>
            <AlertDescription>
              Some URLs already exist in your workspace. These will be skipped during creation.
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed validation list */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {validations.map((validation, index) => {
            if (validation.isValid && !validation.isDuplicate && !validation.existsInDatabase) {
              return null; // Skip valid URLs in detailed view
            }

            return (
              <div
                key={index}
                className="p-3 border rounded-lg space-y-1"
              >
                <div className="flex items-center gap-2">
                  {!validation.isValid && (
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  )}
                  {validation.isDuplicate && (
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                  {validation.existsInDatabase && (
                    <Info className="w-4 h-4 flex-shrink-0 text-white-80" />
                  )}
                  <p className="text-sm font-medium truncate flex-1">{validation.url}</p>
                </div>
                
                <div className="ml-6 space-y-1">
                  {!validation.isValid && validation.error && (
                    <p className="text-xs text-destructive">{validation.error}</p>
                  )}
                  {validation.isDuplicate && (
                    <p className="text-xs text-muted-foreground">
                      Duplicate URL in this batch
                    </p>
                  )}
                  {validation.existsInDatabase && (
                    <p className="text-xs text-muted-foreground">
                      Already exists (slug: {validation.existingSlug})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
