import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, FileText, Image, FileImage, FileCode, ChevronDown, QrCode, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateQRMatrix, QRMatrixResult, BrickStyle, BrickColorId, BRICK_COLORS, getBrickColor } from "@/lib/qrMatrix";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { StepStyle } from "./steps/StepStyle";
import { BrickPreview } from "./BrickPreview";
import { BrickStats } from "./BrickStats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/lib/notify";
import { toPng, toSvg } from "html-to-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { useActivationTracking } from "@/hooks/useActivationTracking";

const STEPS = [
  { id: 1, label: "Content", description: "what to encode" },
  { id: 2, label: "Style", description: "how it looks" },
];

export const BrickBuilderWizard = () => {
  const [step, setStep] = useState(1);
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
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();
  const { trackFirstQR } = useActivationTracking();

  // Generate QR matrix when content changes
  useEffect(() => {
    const generate = async () => {
      const qrResult = await generateQRMatrix(content);
      setResult(qrResult);
    };
    const debounce = setTimeout(generate, 300);
    return () => clearTimeout(debounce);
  }, [content]);

  // Save QR mutation
  const saveQRMutation = useMutation({
    mutationFn: async () => {
      if (!previewRef.current) throw new Error("Preview not ready");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      if (!currentWorkspace?.id) throw new Error("No workspace selected");

      // Generate PNG
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 3, backgroundColor: '#1C1C1E' });
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Upload to storage
      const fileName = `brick-qr-${Date.now()}.png`;
      const filePath = `${currentWorkspace.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from("qr-codes")
        .upload(filePath, blob, { contentType: 'image/png' });
      
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("qr-codes")
        .getPublicUrl(filePath);

      // Determine destination URL and link title based on content type
      const isUrl = content.startsWith('http://') || content.startsWith('https://');
      const destinationUrl = isUrl ? content : `data:text/plain,${encodeURIComponent(content)}`;
      const linkTitle = isUrl 
        ? `Brick QR - ${new URL(content).hostname}` 
        : `Brick QR - ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`;

      // Check if link exists for this content
      const { data: existingLink } = await supabase
        .from("links")
        .select("id")
        .eq("workspace_id", currentWorkspace.id)
        .eq("destination_url", destinationUrl)
        .maybeSingle();

      let linkId: string;

      if (existingLink) {
        linkId = existingLink.id;
      } else {
        // Create a new link
        const slug = `brick-${Date.now().toString(36)}`;
        const shortUrl = `https://utm.one/${slug}`;
        const { data: newLink, error: linkError } = await supabase
          .from("links")
          .insert({
            workspace_id: currentWorkspace.id,
            destination_url: destinationUrl,
            final_url: destinationUrl,
            short_url: shortUrl,
            slug,
            domain: "utm.one",
            path: "",
            created_by: user.id,
            title: linkTitle,
          })
          .select("id")
          .single();

        if (linkError) throw linkError;
        linkId = newLink.id;
      }

      // Save QR to database
      const { data: qrData, error: qrError } = await supabase
        .from("qr_codes")
        .insert({
          link_id: linkId,
          name: `brick-${style}-${Date.now()}`,
          created_by: user.id,
          workspace_id: currentWorkspace.id,
          primary_color: getBrickColor(foreground),
          secondary_color: getBrickColor(background),
          corner_style: style,
          png_url: publicUrl,
        })
        .select()
        .single();

      if (qrError) throw qrError;
      return qrData;
    },
    onSuccess: () => {
      trackFirstQR();
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
      notify.success("Brick QR saved to library!");
    },
    onError: (error: Error) => {
      console.error("Save QR error:", error);
      notify.error(error.message || "Failed to save QR code");
    },
  });

  const canProceed = () => {
    if (step === 1) return content.length > 0 && result.isValid;
    return false;
  };

  const nextStep = () => {
    if (step < 2 && canProceed()) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Parts calculations
  const fgName = BRICK_COLORS.find(c => c.id === foreground)?.name || foreground;
  const bgName = BRICK_COLORS.find(c => c.id === background)?.name || background;
  const fgCount = style === 'inverse' ? result.partsCounts.background : result.partsCounts.foreground;
  const bgCount = style === 'inverse' ? result.partsCounts.foreground : result.partsCounts.background;

  // Download functions
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Controls */}
      <div className="space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                disabled={s.id > step}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm",
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : step > s.id
                    ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                  step > s.id ? "bg-primary text-primary-foreground" : "bg-background/20"
                )}>
                  {s.id}
                </span>
                <span className="font-medium hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "w-8 h-0.5 mx-1",
                  step > s.id ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="p-5">
          {step === 1 && (
            <ContentTypeSelector value={content} onChange={setContent} />
          )}
          {step === 2 && (
            <StepStyle
              style={style}
              onStyleChange={setStyle}
              foreground={foreground}
              background={background}
              onForegroundChange={setForeground}
              onBackgroundChange={setBackground}
            />
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            back
          </Button>
          
          {step < 2 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="gap-2"
            >
              next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setContent("");
              }}
              className="gap-2"
            >
              create another
            </Button>
          )}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="space-y-4">
        <Card className="p-5">
          {/* Preview */}
          <div className="space-y-4">
            {result.isValid ? (
              <>
                <div ref={previewRef} className="max-w-[280px] mx-auto">
                  <BrickPreview result={result} style={style} foreground={foreground} background={background} />
                </div>
                
                {/* Stats */}
                <BrickStats result={result} />

                {/* Parts Summary */}
                <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">parts needed</h4>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-border shadow-sm" style={{ backgroundColor: getBrickColor(style === 'inverse' ? background : foreground) }} />
                      <span className="text-xs"><strong>{fgCount}×</strong> {style === 'inverse' ? bgName : fgName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-border shadow-sm" style={{ backgroundColor: getBrickColor(style === 'inverse' ? foreground : background) }} />
                      <span className="text-xs"><strong>{bgCount}×</strong> {style === 'inverse' ? fgName : bgName}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => saveQRMutation.mutate()}
                    disabled={!result.isValid || saveQRMutation.isPending}
                    className="flex-1 gap-2"
                  >
                    {saveQRMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    save to library
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
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
                </div>

                <p className="text-[10px] text-muted-foreground text-center">not affiliated with The LEGO Group.</p>
              </>
            ) : (
              /* Empty/Placeholder State */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <QrCode className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  live preview
                </h4>
                <p className="text-xs text-muted-foreground/70 max-w-[200px]">
                  {result.warning || "select content to see your brick QR code appear here"}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
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
