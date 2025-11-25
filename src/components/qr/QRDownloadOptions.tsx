import { Button } from "@/components/ui/button";
import { Download, Lock } from "lucide-react";
import { useQRFeatures } from "@/hooks/useQRFeatures";
import { Link } from "react-router-dom";

interface QRDownloadOptionsProps {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onDownloadPDF: () => void;
  isGenerating?: boolean;
}

export const QRDownloadOptions = ({
  onDownloadPNG,
  onDownloadSVG,
  onDownloadPDF,
  isGenerating,
}: QRDownloadOptionsProps) => {
  const { canExportSVG, canExportPDF, isFreeTier } = useQRFeatures();

  return (
    <div className="space-y-3">
      <Button
        onClick={onDownloadPNG}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        <Download className="h-4 w-4 mr-2" />
        download png
      </Button>

      <div className="grid grid-cols-2 gap-2">
        {canExportSVG ? (
          <Button
            onClick={onDownloadSVG}
            disabled={isGenerating}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            svg
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <Lock className="h-4 w-4 mr-2" />
            svg
          </Button>
        )}

        {canExportPDF ? (
          <Button
            onClick={onDownloadPDF}
            disabled={isGenerating}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            pdf
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <Lock className="h-4 w-4 mr-2" />
            pdf
          </Button>
        )}
      </div>

      {isFreeTier && (
        <Link to="/pricing">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            upgrade to unlock svg & pdf
          </Button>
        </Link>
      )}
    </div>
  );
};
