import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ContentTypeSelector } from "@/components/brickmatrix/ContentTypeSelector";
import { BrickStyleSelector } from "@/components/brickmatrix/BrickStyleSelector";
import { BrickColorPalette } from "@/components/brickmatrix/BrickColorPalette";
import { BrickPreview } from "@/components/brickmatrix/BrickPreview";
import { BrickInstructions } from "@/components/brickmatrix/BrickInstructions";
import { generateQRMatrix, QRMatrixResult, BrickStyle, BrickColorId } from "@/lib/qrMatrix";
import { Separator } from "@/components/ui/separator";

export const BrickBuilderContent = () => {
  const [content, setContent] = useState("");
  const [style, setStyle] = useState<BrickStyle>("3d");
  const [foreground, setForeground] = useState<BrickColorId>("black");
  const [background, setBackground] = useState<BrickColorId>("white");
  const [result, setResult] = useState<QRMatrixResult>({
    matrix: [],
    size: 0,
    moduleCount: 0,
    partsCounts: { foreground: 0, background: 0, total: 0 },
    physicalSize: { cm: 0, inches: 0 },
    isValid: false,
    warning: "enter content to generate QR code"
  });
  const previewRef = useRef<HTMLDivElement>(null);

  // Generate QR matrix when content changes
  useEffect(() => {
    const generate = async () => {
      const qrResult = await generateQRMatrix(content);
      setResult(qrResult);
    };
    
    const debounce = setTimeout(generate, 300);
    return () => clearTimeout(debounce);
  }, [content]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        <Card className="p-5 space-y-6">
          <ContentTypeSelector value={content} onChange={setContent} />
          
          <Separator />
          
          <BrickStyleSelector value={style} onChange={setStyle} />
          
          <Separator />
          
          <BrickColorPalette
            foreground={foreground}
            background={background}
            onForegroundChange={setForeground}
            onBackgroundChange={setBackground}
          />
        </Card>

        {/* Instructions Panel - Desktop only */}
        <div className="hidden lg:block">
          <Card className="p-5">
            <BrickInstructions 
              result={result} 
              foreground={foreground} 
              background={background}
              style={style}
              previewRef={previewRef}
            />
          </Card>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="sticky top-24" ref={previewRef}>
          <BrickPreview
            result={result}
            style={style}
            foreground={foreground}
            background={background}
          />
        </div>
      </div>

      {/* Instructions Panel - Mobile only */}
      <div className="lg:hidden">
        <Card className="p-5">
          <BrickInstructions 
            result={result} 
            foreground={foreground} 
            background={background}
            style={style}
            previewRef={previewRef}
          />
        </Card>
      </div>
    </div>
  );
};
