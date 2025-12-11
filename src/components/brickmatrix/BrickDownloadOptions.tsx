import { Button } from "@/components/ui/button";
import { Download, Lock } from "lucide-react";
import { useQRFeatures } from "@/hooks/useQRFeatures";
import { Link } from "react-router-dom";

interface BrickDownloadOptionsProps {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onDownloadPDF: () => void;
  disabled?: boolean;
}

export const BrickDownloadOptions = ({
  onDownloadPNG,
  onDownloadSVG,
  onDownloadPDF,
  disabled,
}: BrickDownloadOptionsProps) => {
  const { canExportSVG, canExportPDF, isFreeTier } = useQRFeatures();

  return (
    <div className="space-y-3">
      <Button
        onClick={onDownloadPNG}
        disabled={disabled}
        className="w-full"
        size="lg"
      >
        <Download className="h-4 w-4 mr-2" />
        download png (hi-res)
      </Button>

      <div className="grid grid-cols-2 gap-2">
        {canExportSVG ? (
          <Button
            onClick={onDownloadSVG}
            disabled={disabled}
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
            disabled={disabled}
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
