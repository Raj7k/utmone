import { useState } from "react";
import { Download, Check, FileText, FileSpreadsheet, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateDownloadProps {
  title: string;
  description?: string;
  fileType: "csv" | "xlsx" | "pdf" | "json";
  fileSize?: string;
  downloadUrl?: string;
  onDownload?: () => void;
  className?: string;
}

const fileIcons = {
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  pdf: FileText,
  json: FileCode,
};

const fileColors = {
  csv: "text-green-600",
  xlsx: "text-emerald-600",
  pdf: "text-red-600",
  json: "text-blue-600",
};

export const TemplateDownload = ({
  title,
  description,
  fileType,
  fileSize,
  downloadUrl,
  onDownload,
  className,
}: TemplateDownloadProps) => {
  const [downloaded, setDownloaded] = useState(false);
  const Icon = fileIcons[fileType];

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
    if (onDownload) {
      onDownload();
    }
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className={cn(
      "my-6 rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300",
      "hover:shadow-lg hover:border-border",
      className
    )}>
      <div className="p-6 flex items-start gap-4">
        {/* File Icon */}
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
          "bg-muted/50"
        )}>
          <Icon className={cn("w-6 h-6", fileColors[fileType])} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          )}
          <div className="flex items-center gap-4">
            {fileSize && (
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {fileType} · {fileSize}
              </span>
            )}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={downloaded}
          className={cn(
            "gap-2 transition-all",
            downloaded && "bg-green-600 hover:bg-green-600"
          )}
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4" />
              Downloaded
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
