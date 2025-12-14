import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extractDominantColors } from "@/lib/colorExtractor";
import { BrandPaletteDisplay } from "./BrandPaletteDisplay";
import { StampPreview, StampPreviewRef } from "./StampPreview";
import { 
  Upload, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Loader2,
  ImageIcon,
  Wand2,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/hooks/auth";

interface AIStampStudioProps {
  shortUrl: string;
  linkId: string;
}

type GenerationPhase = 
  | "idle" 
  | "extracting-colors" 
  | "composing-prompt" 
  | "generating-art" 
  | "applying-edges" 
  | "complete";

const phaseMessages: Record<GenerationPhase, string> = {
  "idle": "",
  "extracting-colors": "extracting brand colors...",
  "composing-prompt": "composing stamp design...",
  "generating-art": "generating ai artwork...",
  "applying-edges": "applying perforated edges...",
  "complete": "stamp ready!",
};

export function AIStampStudio({ shortUrl, linkId }: AIStampStudioProps) {
  const { toast } = useToast();
  const { user } = useAuthSession();
  const stampPreviewRef = useRef<StampPreviewRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [brandColors, setBrandColors] = useState<string[]>([]);
  const [concept, setConcept] = useState("");
  const [generatedStampUrl, setGeneratedStampUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<GenerationPhase>("idle");
  const [qrColor, setQrColor] = useState("#000000");
  const [isSaving, setIsSaving] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);

  const isGenerating = phase !== "idle" && phase !== "complete";

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setUploadedFile(file);

    // Extract colors
    setPhase("extracting-colors");
    try {
      const colors = await extractDominantColors(file, 3);
      setBrandColors(colors);
      
      // Auto-set QR color to darkest extracted color
      const darkestColor = colors.reduce((darkest, color) => {
        const getLuminance = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return 0.299 * r + 0.587 * g + 0.114 * b;
        };
        return getLuminance(color) < getLuminance(darkest) ? color : darkest;
      }, colors[0]);
      setQrColor(darkestColor);
      
      setPhase("idle");
      toast({
        title: "Colors extracted",
        description: `Found ${colors.length} brand colors`,
      });
    } catch (error) {
      setPhase("idle");
      toast({
        title: "Extraction failed",
        description: "Could not extract colors from image",
        variant: "destructive",
      });
    }
  }, [toast]);

  const generateStampArt = async () => {
    if (brandColors.length < 2) {
      toast({
        title: "Upload required",
        description: "Please upload a brand image first",
        variant: "destructive",
      });
      return;
    }

    try {
      setPhase("composing-prompt");
      await new Promise(r => setTimeout(r, 500));
      
      setPhase("generating-art");
      
      const { data, error } = await supabase.functions.invoke("generate-stamp-art", {
        body: {
          brandColors,
          concept: concept || undefined,
          shortUrl,
        },
      });

      if (error) throw error;

      if (!data?.success || !data?.imageUrl) {
        throw new Error(data?.error || "No image generated");
      }

      setPhase("applying-edges");
      await new Promise(r => setTimeout(r, 300));

      setGeneratedStampUrl(data.imageUrl);
      setPhase("complete");

      toast({
        title: "Stamp generated",
        description: "Your branded QR stamp is ready",
      });
    } catch (error) {
      setPhase("idle");
      console.error("Stamp generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Could not generate stamp art",
        variant: "destructive",
      });
    }
  };

  const downloadStamp = async () => {
    if (!stampPreviewRef.current) return;

    try {
      const dataUrl = await stampPreviewRef.current.exportAsPng();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `stamp-qr-${Date.now()}.png`;
      link.click();

      toast({
        title: "Downloaded",
        description: "Stamp QR saved to downloads",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not export stamp",
        variant: "destructive",
      });
    }
  };

  const saveToGallery = async () => {
    if (!stampPreviewRef.current || !user) return;

    setIsSaving(true);
    try {
      // Export stamp as PNG
      const dataUrl = await stampPreviewRef.current.exportAsPng();
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Upload to Supabase storage
      const fileName = `ai-stamp-${linkId}-${Date.now()}.png`;
      const filePath = `${linkId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from("qr-codes")
        .upload(filePath, blob, {
          contentType: "image/png",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("qr-codes")
        .getPublicUrl(filePath);

      // Fetch link to get workspace_id
      const { data: linkData } = await supabase
        .from("links")
        .select("workspace_id")
        .eq("id", linkId)
        .single();

      // Insert into qr_codes table
      const { error: insertError } = await supabase
        .from("qr_codes")
        .insert({
          link_id: linkId,
          name: concept ? `AI Stamp - ${concept}` : "AI Stamp QR",
          variant_name: concept || "AI Generated",
          png_url: publicUrl,
          created_by: user.id,
          workspace_id: linkData?.workspace_id,
        });

      if (insertError) throw insertError;

      setSavedToGallery(true);
      toast({
        title: "Saved to gallery",
        description: "AI Stamp QR added to your gallery",
      });
    } catch (error) {
      console.error("Save to gallery error:", error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save to gallery",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const regenerate = () => {
    setGeneratedStampUrl(null);
    setPhase("idle");
    setSavedToGallery(false);
    generateStampArt();
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Stamp Studio</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              PREMIUM
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Upload your brand logo to generate a custom vintage stamp-style QR code with AI.
          </p>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-muted/30",
              uploadedImage ? "border-primary/30" : "border-border"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {uploadedImage ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={uploadedImage}
                  alt="Uploaded brand"
                  className="h-20 w-20 object-contain rounded-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Click to change image
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-muted rounded-full">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Upload Brand Logo</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, or SVG up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Extracted Colors */}
          {brandColors.length > 0 && (
            <BrandPaletteDisplay colors={brandColors} />
          )}
        </div>
      </Card>

      {/* Theme Input */}
      {brandColors.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="concept">Stamp Theme (optional)</Label>
            <Input
              id="concept"
              placeholder="e.g., retro travel, futuristic tech, tropical adventure..."
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Describe the style for your stamp background
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrColor">QR Code Color</Label>
            <div className="flex gap-2">
              <Input
                id="qrColor"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
                disabled={isGenerating}
              />
              <Input
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                placeholder="#000000"
                disabled={isGenerating}
              />
            </div>
          </div>

          <Button
            onClick={generateStampArt}
            disabled={isGenerating || brandColors.length < 2}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {phaseMessages[phase]}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Stamp Art
              </>
            )}
          </Button>
        </Card>
      )}

      {/* Generated Stamp Preview */}
      {generatedStampUrl && phase === "complete" && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Your AI Stamp QR
            </h3>
            <span className="text-xs bg-system-green/10 text-system-green px-2 py-0.5 rounded-full font-medium">
              AI GENERATED
            </span>
          </div>

          <div className="flex justify-center py-4">
            <StampPreview
              ref={stampPreviewRef}
              stampArtUrl={generatedStampUrl}
              qrValue={shortUrl}
              qrColor={qrColor}
              size={320}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={saveToGallery} 
              disabled={isSaving || savedToGallery}
              className="flex-1 gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {savedToGallery ? "Saved to Gallery" : "Save to Gallery"}
            </Button>
            <Button variant="outline" onClick={downloadStamp} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={regenerate} className="gap-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
