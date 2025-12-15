import { useRef } from "react";
import { QRMatrixResult, BrickStyle, BrickColorId, BRICK_COLORS, getBrickColor } from "@/lib/qrMatrix";
import { BrickPreview } from "../BrickPreview";
import { BrickStats } from "../BrickStats";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, FileImage, FileCode, ChevronDown } from "lucide-react";
import { notify } from "@/lib/notify";
import { toPng, toSvg } from "html-to-image";

interface StepPreviewProps {
  result: QRMatrixResult;
  style: BrickStyle;
  foreground: BrickColorId;
  background: BrickColorId;
}

export const StepPreview = ({ result, style, foreground, background }: StepPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  const fgName = BRICK_COLORS.find(c => c.id === foreground)?.name || foreground;
  const bgName = BRICK_COLORS.find(c => c.id === background)?.name || background;
  const fgCount = style === 'inverse' ? result.partsCounts.background : result.partsCounts.foreground;
  const bgCount = style === 'inverse' ? result.partsCounts.foreground : result.partsCounts.background;

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      notify.error("popup blocked");
      return;
    }

    const gridHTML = generateGridHTML(result, foreground, background, style);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BrickMatrix Build Instructions</title>
          <style>
            body { font-family: -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            .parts-list { display: flex; gap: 24px; margin-bottom: 32px; padding: 16px; background: #f5f5f5; border-radius: 8px; }
            .part { display: flex; align-items: center; gap: 8px; }
            .swatch { width: 20px; height: 20px; border-radius: 4px; border: 1px solid #ddd; }
            .grid { display: grid; gap: 1px; background: #eee; padding: 1px; border-radius: 4px; }
            .cell { width: 12px; height: 12px; border-radius: 2px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>BrickMatrix Build Instructions</h1>
          <div class="parts-list">
            <div class="part"><div class="swatch" style="background: ${getBrickColor(style === 'inverse' ? background : foreground)}"></div><span><strong>${fgCount}×</strong> ${style === 'inverse' ? bgName : fgName}</span></div>
            <div class="part"><div class="swatch" style="background: ${getBrickColor(style === 'inverse' ? foreground : background)}"></div><span><strong>${bgCount}×</strong> ${style === 'inverse' ? fgName : bgName}</span></div>
          </div>
          <p><strong>Size:</strong> ${result.size}×${result.size} studs</p>
          ${gridHTML}
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    notify.success("instructions ready");
  };

  const downloadPNG = async () => {
    if (!previewRef?.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 3, backgroundColor: '#1C1C1E' });
      const link = document.createElement('a');
      link.download = 'brickmatrix-qr.png';
      link.href = dataUrl;
      link.click();
      notify.success("PNG downloaded");
    } catch { notify.error("failed to export PNG"); }
  };

  const downloadSVG = async () => {
    if (!previewRef?.current) return;
    try {
      const dataUrl = await toSvg(previewRef.current);
      const link = document.createElement('a');
      link.download = 'brickmatrix-qr.svg';
      link.href = dataUrl;
      link.click();
      notify.success("SVG downloaded");
    } catch { notify.error("failed to export SVG"); }
  };

  const downloadBrickLinkXML = () => {
    const colorMap: Record<BrickColorId, number> = {
      'black': 11, 'white': 1, 'red': 5, 'blue': 7, 'yellow': 3, 'green': 6, 'orange': 4,
      'tan': 2, 'dark-gray': 8, 'light-gray': 9, 'dark-blue': 63, 'dark-green': 80, 'pink': 104, 'lavender': 138,
    };
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<INVENTORY>
  <ITEM><ITEMTYPE>P</ITEMTYPE><ITEMID>3024</ITEMID><COLOR>${colorMap[style === 'inverse' ? background : foreground] || 11}</COLOR><MINQTY>${fgCount}</MINQTY></ITEM>
  <ITEM><ITEMTYPE>P</ITEMTYPE><ITEMID>3024</ITEMID><COLOR>${colorMap[style === 'inverse' ? foreground : background] || 11}</COLOR><MINQTY>${bgCount}</MINQTY></ITEM>
</INVENTORY>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brickmatrix-parts.xml';
    a.click();
    URL.revokeObjectURL(url);
    notify.success("BrickLink XML downloaded");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">your brick QR is ready!</h3>
        <p className="text-sm text-muted-foreground">preview and download your build instructions</p>
      </div>

      {/* Preview */}
      <div ref={previewRef} className="max-w-sm mx-auto">
        <BrickPreview result={result} style={style} foreground={foreground} background={background} />
      </div>

      {/* Stats */}
      <BrickStats result={result} />

      {/* Parts Summary */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
        <h4 className="text-sm font-medium">parts needed</h4>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-border shadow-sm" style={{ backgroundColor: getBrickColor(style === 'inverse' ? background : foreground) }} />
            <span className="text-sm"><strong>{fgCount}×</strong> {style === 'inverse' ? bgName : fgName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-border shadow-sm" style={{ backgroundColor: getBrickColor(style === 'inverse' ? foreground : background) }} />
            <span className="text-sm"><strong>{bgCount}×</strong> {style === 'inverse' ? fgName : bgName}</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full gap-2" size="lg">
            <Download className="h-4 w-4" />
            download
            <ChevronDown className="h-4 w-4 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuItem onClick={downloadPDF} className="gap-2">
            <FileText className="h-4 w-4" /> PDF instructions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadPNG} className="gap-2">
            <Image className="h-4 w-4" /> PNG image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadSVG} className="gap-2">
            <FileImage className="h-4 w-4" /> SVG vector
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={downloadBrickLinkXML} className="gap-2">
            <FileCode className="h-4 w-4" /> BrickLink XML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <p className="text-[10px] text-muted-foreground text-center">not affiliated with The LEGO Group.</p>
    </div>
  );
};

function generateGridHTML(result: QRMatrixResult, fg: BrickColorId, bg: BrickColorId, style: BrickStyle): string {
  const fgColor = getBrickColor(style === 'inverse' ? bg : fg);
  const bgColor = getBrickColor(style === 'inverse' ? fg : bg);
  let html = `<div class="grid" style="grid-template-columns: repeat(${result.size}, 1fr);">`;
  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const isActive = result.matrix[row]?.[col] ?? false;
      html += `<div class="cell" style="background: ${isActive ? fgColor : bgColor}"></div>`;
    }
  }
  return html + '</div>';
}
