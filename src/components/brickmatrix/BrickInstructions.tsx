import { RefObject } from "react";
import { QRMatrixResult, BrickColorId, BRICK_COLORS, getBrickColor, BrickStyle } from "@/lib/qrMatrix";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileCode, Image, FileImage, ChevronDown } from "lucide-react";
import { notify } from "@/lib/notify";
import { toPng, toSvg } from "html-to-image";

interface BrickInstructionsProps {
  result: QRMatrixResult;
  foreground: BrickColorId;
  background: BrickColorId;
  style: BrickStyle;
  previewRef?: RefObject<HTMLDivElement>;
}

export const BrickInstructions = ({ result, foreground, background, style, previewRef }: BrickInstructionsProps) => {
  const fgName = BRICK_COLORS.find(c => c.id === foreground)?.name || foreground;
  const bgName = BRICK_COLORS.find(c => c.id === background)?.name || background;

  // For inverse, swap the colors in the count
  const fgCount = style === 'inverse' ? result.partsCounts.background : result.partsCounts.foreground;
  const bgCount = style === 'inverse' ? result.partsCounts.foreground : result.partsCounts.background;

  const downloadPDF = () => {
    // Generate a simple HTML-based printable page
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      notify.error("popup blocked", { description: "please allow popups to download instructions." });
      return;
    }

    const gridHTML = generateGridHTML(result, foreground, background, style);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BrickMatrix Build Instructions</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              padding: 40px; 
              max-width: 800px; 
              margin: 0 auto;
            }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; color: #666; font-weight: normal; margin-bottom: 32px; }
            .parts-list { 
              display: flex; 
              gap: 24px; 
              margin-bottom: 32px;
              padding: 16px;
              background: #f5f5f5;
              border-radius: 8px;
            }
            .part { display: flex; align-items: center; gap: 8px; }
            .swatch { 
              width: 20px; 
              height: 20px; 
              border-radius: 4px; 
              border: 1px solid #ddd;
            }
            .grid-container { margin-top: 24px; }
            .grid { 
              display: grid; 
              gap: 1px; 
              background: #eee;
              padding: 1px;
              border-radius: 4px;
            }
            .cell { 
              width: 16px; 
              height: 16px; 
              border-radius: 2px;
            }
            .disclaimer {
              margin-top: 32px;
              padding: 16px;
              background: #f9f9f9;
              border-radius: 8px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { padding: 20px; }
              .cell { width: 12px; height: 12px; }
            }
          </style>
        </head>
        <body>
          <h1>BrickMatrix Build Instructions</h1>
          <h2>QR Code Building Guide</h2>
          
          <div class="parts-list">
            <div class="part">
              <div class="swatch" style="background: ${getBrickColor(style === 'inverse' ? background : foreground)}"></div>
              <span><strong>${fgCount}×</strong> ${style === 'inverse' ? bgName : fgName} 1×1 ${style === 'flat' ? 'Tiles' : 'Plates'}</span>
            </div>
            <div class="part">
              <div class="swatch" style="background: ${getBrickColor(style === 'inverse' ? foreground : background)}"></div>
              <span><strong>${bgCount}×</strong> ${style === 'inverse' ? fgName : bgName} 1×1 ${style === 'flat' ? 'Tiles' : 'Plates'}</span>
            </div>
          </div>

          <p><strong>Size:</strong> ${result.size}×${result.size} studs (~${result.physicalSize.cm.toFixed(1)}cm)</p>

          <div class="grid-container">
            <h3>Build Grid</h3>
            ${gridHTML}
          </div>

          <div class="disclaimer">
            <strong>Disclaimer:</strong> This tool generates building instructions for generic interlocking bricks. 
            Not affiliated with The LEGO Group. LEGO® is a trademark of The LEGO Group.
          </div>

          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    notify.success("instructions ready");
  };

  const downloadPNG = async () => {
    if (!previewRef?.current) {
      notify.error("preview not ready");
      return;
    }
    
    try {
      const dataUrl = await toPng(previewRef.current, { 
        pixelRatio: 3,
        backgroundColor: '#1C1C1E'
      });
      const link = document.createElement('a');
      link.download = 'brickmatrix-qr.png';
      link.href = dataUrl;
      link.click();
      notify.success("PNG downloaded");
    } catch (err) {
      notify.error("failed to export PNG");
    }
  };

  const downloadSVG = async () => {
    if (!previewRef?.current) {
      notify.error("preview not ready");
      return;
    }
    
    try {
      const dataUrl = await toSvg(previewRef.current);
      const link = document.createElement('a');
      link.download = 'brickmatrix-qr.svg';
      link.href = dataUrl;
      link.click();
      notify.success("SVG downloaded");
    } catch (err) {
      notify.error("failed to export SVG");
    }
  };

  const downloadBrickLinkXML = () => {
    // BrickLink XML format for ordering parts
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<INVENTORY>
  <ITEM>
    <ITEMTYPE>P</ITEMTYPE>
    <ITEMID>3024</ITEMID>
    <COLOR>${getBrickLinkColorId(style === 'inverse' ? background : foreground)}</COLOR>
    <MINQTY>${fgCount}</MINQTY>
  </ITEM>
  <ITEM>
    <ITEMTYPE>P</ITEMTYPE>
    <ITEMID>3024</ITEMID>
    <COLOR>${getBrickLinkColorId(style === 'inverse' ? foreground : background)}</COLOR>
    <MINQTY>${bgCount}</MINQTY>
  </ITEM>
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

  if (!result.isValid) return null;

  return (
    <div className="space-y-4">
      {/* Parts Summary */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
        <h3 className="text-sm font-medium">parts needed</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-md border border-border shadow-sm"
              style={{ backgroundColor: getBrickColor(style === 'inverse' ? background : foreground) }}
            />
            <span className="text-sm">
              <strong>{fgCount}×</strong> {style === 'inverse' ? bgName : fgName} 1×1 {style === 'flat' ? 'Tiles' : 'Plates'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-md border border-border shadow-sm"
              style={{ backgroundColor: getBrickColor(style === 'inverse' ? foreground : background) }}
            />
            <span className="text-sm">
              <strong>{bgCount}×</strong> {style === 'inverse' ? fgName : bgName} 1×1 {style === 'flat' ? 'Tiles' : 'Plates'}
            </span>
          </div>
        </div>
      </div>

      {/* Download Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full gap-2" size="lg">
            <Download className="h-4 w-4" />
            download
            <ChevronDown className="h-4 w-4 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={downloadPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            PDF instructions
            <span className="ml-auto text-xs text-muted-foreground">print-ready</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadPNG} className="gap-2">
            <Image className="h-4 w-4" />
            PNG image
            <span className="ml-auto text-xs text-muted-foreground">high-res</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadSVG} className="gap-2">
            <FileImage className="h-4 w-4" />
            SVG vector
            <span className="ml-auto text-xs text-muted-foreground">scalable</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={downloadBrickLinkXML} className="gap-2">
            <FileCode className="h-4 w-4" />
            BrickLink XML
            <span className="ml-auto text-xs text-muted-foreground">order parts</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        not affiliated with The LEGO Group.
      </p>
    </div>
  );
};

// Generate HTML grid for print
function generateGridHTML(result: QRMatrixResult, fg: BrickColorId, bg: BrickColorId, style: BrickStyle): string {
  const fgColor = getBrickColor(style === 'inverse' ? bg : fg);
  const bgColor = getBrickColor(style === 'inverse' ? fg : bg);
  
  let html = `<div class="grid" style="grid-template-columns: repeat(${result.size}, 1fr);">`;
  
  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const isActive = result.matrix[row]?.[col] ?? false;
      const color = isActive ? fgColor : bgColor;
      html += `<div class="cell" style="background: ${color}"></div>`;
    }
  }
  
  html += '</div>';
  return html;
}

// Map our color IDs to approximate BrickLink color IDs
function getBrickLinkColorId(colorId: BrickColorId): number {
  const colorMap: Record<BrickColorId, number> = {
    'black': 11,
    'white': 1,
    'red': 5,
    'blue': 7,
    'yellow': 3,
    'green': 6,
    'orange': 4,
    'tan': 2,
    'dark-gray': 8,
    'light-gray': 9,
    'dark-blue': 63,
    'dark-green': 80,
    'pink': 104,
    'lavender': 138,
  };
  return colorMap[colorId] || 11;
}
