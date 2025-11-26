import { useState } from "react";
import { useQRFeatures } from "@/hooks/useQRFeatures";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BulkQRPresetSelector } from "./BulkQRPresetSelector";
import { Download, QrCode, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkQRGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: Array<{ id: string; short_url: string; slug: string }>;
}

export const BulkQRGenerator = ({ open, onOpenChange, links }: BulkQRGeneratorProps) => {
  const { canBulkGenerateQR } = useQRFeatures();
  const [primaryColor, setPrimaryColor] = useState("#EE3B3B");
  const [secondaryColor, setSecondaryColor] = useState("#1A1A1A");
  const [cornerStyle, setCornerStyle] = useState<"square" | "rounded">("rounded");
  const [frameText, setFrameText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!canBulkGenerateQR) {
      toast.error("Bulk QR generation requires enterprise plan");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const { data, error } = await supabase.functions.invoke('bulk-generate-qr', {
        body: {
          links: links.map(link => ({
            id: link.id,
            short_url: link.short_url,
            name: link.slug,
          })),
          preset: {
            primaryColor,
            secondaryColor,
            cornerStyle,
            frameText: frameText || undefined,
          },
        },
      });

      if (error) throw error;

      toast.success(`Generated ${data.results.length} QR codes`, {
        description: "Check your downloads folder",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Bulk QR generation error:", error);
      toast.error("Failed to generate QR codes");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  if (!canBulkGenerateQR) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              enterprise feature
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bulk QR code generation is available on enterprise plans.
            </p>
            <Button variant="default" className="w-full" onClick={() => onOpenChange(false)}>
              upgrade to enterprise
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            bulk generate QR codes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Generating QR codes for {links.length} links
          </div>

          <BulkQRPresetSelector
            onSelectPreset={(preset) => {
              setPrimaryColor(preset.primaryColor);
              setSecondaryColor(preset.secondaryColor);
              setCornerStyle(preset.cornerStyle);
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">primary color</Label>
              <Input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">secondary color</Label>
              <Input
                id="secondary-color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corner-style">corner style</Label>
            <Select value={cornerStyle} onValueChange={(val: "square" | "rounded") => setCornerStyle(val)}>
              <SelectTrigger id="corner-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">square</SelectItem>
                <SelectItem value="rounded">rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frame-text">frame text (optional)</Label>
            <Input
              id="frame-text"
              value={frameText}
              onChange={(e) => setFrameText(e.target.value)}
              placeholder="scan me"
            />
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground text-center">
                generating QR codes...
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              generate & download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
