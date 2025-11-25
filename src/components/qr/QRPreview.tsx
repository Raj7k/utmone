import QRCode from "react-qr-code";
import { useQRFeatures } from "@/hooks/useQRFeatures";

interface QRPreviewProps {
  url: string;
  primaryColor: string;
  backgroundColor: string;
  size?: number;
}

export const QRPreview = ({
  url,
  primaryColor,
  backgroundColor,
  size = 256,
}: QRPreviewProps) => {
  const { canRemoveQRWatermark } = useQRFeatures();

  if (!url) {
    return (
      <div
        className="bg-muted/20 rounded-lg flex items-center justify-center text-secondary-label"
        style={{ width: size, height: size }}
      >
        enter url to preview
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <QRCode
        value={url}
        size={size}
        fgColor={primaryColor}
        bgColor={backgroundColor}
        level="H"
      />
      {!canRemoveQRWatermark && (
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground font-medium border border-border/20">
          utm.one
        </div>
      )}
    </div>
  );
};
