import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrickStyleSelector } from "@/components/brickmatrix/BrickStyleSelector";
import { BrickColorPicker } from "@/components/brickmatrix/BrickColorPicker";
import { BrickPreview } from "@/components/brickmatrix/BrickPreview";
import { BrickDownloadOptions } from "@/components/brickmatrix/BrickDownloadOptions";
import { generateQRMatrix, QRMatrixResult, BrickStyle } from "@/lib/qrMatrix";
import { notify } from "@/lib/notify";

export const BrickBuilderContent = () => {
  const [content, setContent] = useState("");
  const [style, setStyle] = useState<BrickStyle>("3d");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#FFFFFF");
  const [result, setResult] = useState<QRMatrixResult>({
    matrix: [],
    size: 0,
    moduleCount: 0,
    partsCounts: { foreground: 0, background: 0, total: 0 },
    physicalSize: { cm: 0, inches: 0 },
    isValid: false,
    warning: "enter content to generate QR code"
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const generate = async () => {
      const qrResult = await generateQRMatrix(content);
      setResult(qrResult);
    };
    
    const debounce = setTimeout(generate, 300);
    return () => clearTimeout(debounce);
  }, [content]);

  const downloadPNG = async () => {
    if (!result.isValid) return;
    
    const svg = svgRef.current;
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const size = 2048;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.download = "brick-qr.png";
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          notify.success("png downloaded");
        }
      }, "image/png");
      
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadSVG = () => {
    if (!result.isValid) return;
    
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "brick-qr.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    notify.success("svg downloaded");
  };

  const downloadPDF = () => {
    if (!result.isValid) return;
    
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      notify.error("popup blocked");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Brick QR Code</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            svg { max-width: 100%; max-height: 100vh; }
          </style>
        </head>
        <body>
          ${svgData}
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    notify.success("pdf ready");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">url or text</Label>
          <Input
            placeholder="https://example.com or any text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-11"
          />
        </div>

        <BrickStyleSelector value={style} onChange={setStyle} />

        <BrickColorPicker
          foreground={foreground}
          background={background}
          onForegroundChange={setForeground}
          onBackgroundChange={setBackground}
        />
      </div>

      {/* Right Panel - Preview & Downloads */}
      <div className="space-y-6">
        <BrickPreview
          ref={svgRef}
          result={result}
          style={style}
          foreground={foreground}
          background={background}
        />

        <BrickDownloadOptions
          onDownloadPNG={downloadPNG}
          onDownloadSVG={downloadSVG}
          onDownloadPDF={downloadPDF}
          disabled={!result.isValid}
        />
      </div>
    </div>
  );
};
