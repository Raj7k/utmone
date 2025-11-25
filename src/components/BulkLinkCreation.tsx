import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface BulkLinkCreationProps {
  workspaceId: string;
  onSuccess?: () => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export const BulkLinkCreation = ({ workspaceId, onSuccess }: BulkLinkCreationProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const downloadTemplate = () => {
    const csvContent = `title,destination_url,slug,utm_source,utm_medium,utm_campaign,utm_term,utm_content
Summer Sale Landing Page,https://example.com/summer-sale,summer-sale,instagram,social,summer-2025,,hero-banner
Product Launch Email,https://example.com/new-product,new-product,newsletter,email,product-launch,,
Partner Referral Link,https://example.com/partner,partner-link,partner-name,referral,partnership,,`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-links-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv") {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setErrors([]);
      setSuccessCount(0);
      setTotalCount(0);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(",");
      const row: any = { _rowNumber: i + 1 };
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });
      data.push(row);
    }

    return data;
  };

  const validateRow = (row: any, rowNumber: number): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!row.title) {
      errors.push({ row: rowNumber, field: "title", message: "Title is required" });
    }
    if (!row.destination_url || !row.destination_url.startsWith("http")) {
      errors.push({ row: rowNumber, field: "destination_url", message: "Valid URL required" });
    }
    if (!row.utm_source) {
      errors.push({ row: rowNumber, field: "utm_source", message: "UTM Source is required" });
    }
    if (!row.utm_medium) {
      errors.push({ row: rowNumber, field: "utm_medium", message: "UTM Medium is required" });
    }
    if (!row.utm_campaign) {
      errors.push({ row: rowNumber, field: "utm_campaign", message: "UTM Campaign is required" });
    }

    return errors;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setErrors([]);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length === 0) {
        toast({
          title: "Empty file",
          description: "CSV file contains no data",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      if (rows.length > 100) {
        toast({
          title: "Too many rows",
          description: "Maximum 100 links per upload",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      setTotalCount(rows.length);

      // Validate all rows
      const allErrors: ValidationError[] = [];
      rows.forEach((row) => {
        const rowErrors = validateRow(row, row._rowNumber);
        allErrors.push(...rowErrors);
      });

      if (allErrors.length > 0) {
        setErrors(allErrors);
        toast({
          title: "Validation failed",
          description: `Found ${allErrors.length} errors. Review and fix before uploading.`,
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Call bulk create edge function
      const { data, error } = await supabase.functions.invoke("bulk-create-links", {
        body: {
          workspace_id: workspaceId,
          links: rows,
        },
      });

      if (error) throw error;

      setSuccessCount(data.success_count);
      if (data.errors && data.errors.length > 0) {
        setErrors(data.errors);
      }

      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });

      toast({
        title: "Bulk upload complete",
        description: `${data.success_count} of ${rows.length} links created successfully`,
      });

      setProgress(100);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadErrorReport = () => {
    const csvContent = `Row,Field,Error\n${errors.map((e) => `${e.row},${e.field},${e.message}`).join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-upload-errors.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Bulk Link Creation</h3>
              <p className="text-sm text-secondary-label">
                Upload a CSV file to create up to 100 links at once
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Button variant="outline" className="pointer-events-none">
                Choose CSV File
              </Button>
            </label>
            {file && (
              <p className="text-sm text-secondary-label mt-2">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Results */}
          {totalCount > 0 && !isUploading && (
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {errors.length === 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-system-green" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">
                      {successCount} of {totalCount} links created
                    </p>
                    {errors.length > 0 && (
                      <p className="text-sm text-destructive">{errors.length} errors found</p>
                    )}
                  </div>
                </div>
                {errors.length > 0 && (
                  <Button variant="outline" size="sm" onClick={downloadErrorReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Error Report
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Card className="p-4 bg-destructive/5 border-destructive/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-2">Validation Errors</p>
                  <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                    {errors.slice(0, 10).map((error, i) => (
                      <p key={i} className="text-destructive">
                        Row {error.row}: {error.field} - {error.message}
                      </p>
                    ))}
                    {errors.length > 10 && (
                      <p className="text-secondary-label">
                        + {errors.length - 10} more errors...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1"
            >
              {isUploading ? "Uploading..." : "Upload & Create Links"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
