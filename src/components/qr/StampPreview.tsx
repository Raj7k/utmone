import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import QRCode from "react-qr-code";
import { StampEdgeMask } from "./StampEdgeMask";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";

interface StampPreviewProps {
  stampArtUrl: string;
  qrValue: string;
  qrColor?: string;
  size?: number;
  className?: string;
}

export interface StampPreviewRef {
  exportAsPng: () => Promise<string>;
}

export const StampPreview = forwardRef<StampPreviewRef, StampPreviewProps>(
  ({ stampArtUrl, qrValue, qrColor = "#000000", size = 320, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      exportAsPng: async () => {
        if (!containerRef.current) throw new Error("Container not ready");
        
        const dataUrl = await toPng(containerRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });
        
        return dataUrl;
      },
    }));

    // Calculate QR code size (58% of stamp size for better scannability)
    const qrSize = Math.floor(size * 0.58);
    const qrContainerSize = Math.floor(size * 0.65);

    return (
      <div className={cn("relative inline-block", className)}>
        <StampEdgeMask size={size}>
          <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            style={{ width: size, height: size }}
          >
            {/* Layer 1: AI-generated stamp background */}
            <img
              src={stampArtUrl}
              alt="Stamp background"
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            
            {/* Layer 2: White/light center overlay for QR code */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex items-center justify-center"
              style={{
                width: qrContainerSize,
                height: qrContainerSize,
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(2px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Layer 3: Functional QR Code */}
              <QRCode
                value={qrValue}
                size={qrSize}
                fgColor={qrColor}
                bgColor="transparent"
                level="H"
              />
            </div>
          </div>
        </StampEdgeMask>
        
        {/* Subtle drop shadow */}
        <div 
          className="absolute inset-0 -z-10 rounded-lg"
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            transform: "translateY(4px)",
          }}
        />
      </div>
    );
  }
);

StampPreview.displayName = "StampPreview";
