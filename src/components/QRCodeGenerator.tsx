import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { QRDownloadOptions } from "./qr/QRDownloadOptions";
import { AIStyleRecommendation } from "./qr/AIStyleRecommendation";
import { AIStampStudio } from "./qr/AIStampStudio";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGTMEvents } from "./integrations/GTMProvider";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

const qrFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  variantName: z.string().optional(),
  primaryColor: z.string().default("#EE3B3B"),
  secondaryColor: z.string().default("#FED42F"),
  cornerStyle: z.enum(["square", "rounded"]).default("square"),
  frameText: z.string().optional(),
  hasLogo: z.boolean().default(false),
});

type QRFormData = z.infer<typeof qrFormSchema>;

interface QRCodeGeneratorProps {
  linkId: string;
  shortUrl: string;
  onSuccess?: () => void;
}

export const QRCodeGenerator = ({ linkId, shortUrl, onSuccess }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { trackQRGeneration } = useGTMEvents();
  const { currentWorkspace } = useWorkspaceContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedQRCode, setGeneratedQRCode] = useState<{ png_url: string; svg_url: string } | null>(null);

  const form = useForm<QRFormData>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      name: "QR Code",
      primaryColor: "#EE3B3B",
      secondaryColor: "#FED42F",
      cornerStyle: "square",
      hasLogo: false,
    },
  });

  const { register, watch, setValue, reset } = form;
  const formValues = watch();

  const generateQRMutation = useMutation({
    mutationFn: async (data: QRFormData) => {
      try {
        setIsGenerating(true);

        // Normalize URL to Supabase edge function format
        const normalizeUrl = (url: string) => {
          const match = url.match(/\/([^\/]+)\/([^\/]+)$/);
          if (match) {
            const [, path, slug] = match;
            return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect/${path}/${slug}`;
          }
          return url;
        };

        const normalizedShortUrl = normalizeUrl(shortUrl);

        if (!normalizedShortUrl) {
          throw new Error("No URL provided for QR code generation. Please ensure the link has a valid short URL.");
        }

        // Generate PNG using qrcode library
        const pngDataUrl = await QRCodeLib.toDataURL(normalizedShortUrl, {
          width: 1024,
          margin: 2,
          color: {
            dark: data.primaryColor,
            light: "#FFFFFF",
          },
        });

        // Convert data URL to blob
        const pngBlob = await fetch(pngDataUrl).then((r) => r.blob());

        // Generate SVG
        const svgString = await QRCodeLib.toString(normalizedShortUrl, {
          type: "svg",
          width: 1024,
          margin: 2,
          color: {
            dark: data.primaryColor,
            light: "#FFFFFF",
          },
        });
        const svgBlob = new Blob([svgString], { type: "image/svg+xml" });

        // Upload to storage
        const timestamp = Date.now();
        const pngPath = `${linkId}/${timestamp}-${data.name.replace(/\s+/g, "-")}.png`;
        const svgPath = `${linkId}/${timestamp}-${data.name.replace(/\s+/g, "-")}.svg`;

        
        const { error: pngError } = await supabase.storage
          .from("qr-codes")
          .upload(pngPath, pngBlob);

        if (pngError) {
          console.error("❌ [QR Generation] PNG upload failed:", pngError);
          throw pngError;
        }
        

        
        const { error: svgError } = await supabase.storage
          .from("qr-codes")
          .upload(svgPath, svgBlob);

        if (svgError) {
          console.error("❌ [QR Generation] SVG upload failed:", svgError);
          throw svgError;
        }
        

        // Get public URLs
        const { data: pngUrlData } = supabase.storage
          .from("qr-codes")
          .getPublicUrl(pngPath);

        const { data: svgUrlData } = supabase.storage
          .from("qr-codes")
          .getPublicUrl(svgPath);


        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        

        // Save to database
        const insertData = {
          link_id: linkId,
          created_by: user.id,
          name: data.name,
          variant_name: data.variantName,
          primary_color: data.primaryColor,
          secondary_color: data.secondaryColor,
          corner_style: data.cornerStyle,
          frame_text: data.frameText,
          has_logo: data.hasLogo,
          png_url: pngUrlData.publicUrl,
          svg_url: svgUrlData.publicUrl,
          workspace_id: currentWorkspace?.id,
        };
        

        const { data: qrCode, error: dbError } = await supabase
          .from("qr_codes")
          .insert(insertData)
          .select()
          .single();

        if (dbError) {
          console.error("❌ [QR Generation] Database insert failed:", dbError);
          console.error("📋 [QR Generation] Full error details:", JSON.stringify(dbError, null, 2));
          throw dbError;
        }
        

        // Track QR generation in GTM
        trackQRGeneration(linkId, data.name);

        return qrCode;
      } catch (error) {
        console.error("💥 [QR Generation] Unexpected error:", error);
        console.error("📋 [QR Generation] Error stack:", error instanceof Error ? error.stack : "No stack trace");
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "QR Code Generated",
        description: "Your branded QR Code has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["qr-codes", linkId] });
      setIsGenerating(false);
      setGeneratedQRCode({ png_url: data.png_url, svg_url: data.svg_url });
      setShowSuccess(true);
    },
    onError: (error: Error) => {
      console.error("❌ [QR Generation] Mutation error:", error);
      console.error("📋 [QR Generation] Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      toast({
        title: "Generation Failed",
        description: error.message || "An unexpected error occurred. Check console for details.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const downloadQR = async (format: "png" | "svg") => {
    try {
      // Normalize URL to Supabase edge function format
      const normalizeUrl = (url: string) => {
        const match = url.match(/\/([^\/]+)\/([^\/]+)$/);
        if (match) {
          const [, path, slug] = match;
          return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect/${path}/${slug}`;
        }
        return url;
      };

      const normalizedShortUrl = normalizeUrl(shortUrl);

      if (!normalizedShortUrl) {
        throw new Error("No URL provided for QR code generation.");
      }
      let dataUrl: string;
      let filename: string;

      if (format === "png") {
        dataUrl = await QRCodeLib.toDataURL(normalizedShortUrl, {
          width: 1024,
          margin: 2,
          color: {
            dark: formValues.primaryColor,
            light: "#FFFFFF",
          },
        });
        filename = `qr-${formValues.name.replace(/\s+/g, "-")}.png`;
      } else {
        const svgString = await QRCodeLib.toString(normalizedShortUrl, {
          type: "svg",
          width: 1024,
          margin: 2,
          color: {
            dark: formValues.primaryColor,
            light: "#FFFFFF",
          },
        });
        dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
        filename = `qr-${formValues.name.replace(/\s+/g, "-")}.svg`;
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download QR code",
        variant: "destructive",
      });
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    generateQRMutation.mutate(data);
  });

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setGeneratedQRCode(null);
    reset();
  };

  const handleViewGallery = () => {
    onSuccess?.();
  };

  const downloadFromUrl = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      toast({
        title: "Downloaded",
        description: `${filename} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download file",
        variant: "destructive",
      });
    }
  };

  if (showSuccess && generatedQRCode) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-system-green/10 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-system-green" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-label">QR Code Generated Successfully!</h3>
            <p className="text-secondary-label mt-2">Your QR Code is ready to download and use</p>
          </div>
        </div>

        <Card className="p-6 flex flex-col items-center gap-4">
          <div className="bg-card p-4 rounded-lg">
            <QRCode
              value={(() => {
                const match = shortUrl.match(/\/([^\/]+)\/([^\/]+)$/);
                if (match) {
                  const [, path, slug] = match;
                  return `https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/redirect/${path}/${slug}`;
                }
                return shortUrl;
              })()}
              size={256}
              fgColor={formValues.primaryColor}
              bgColor="#FFFFFF"
              level="H"
            />
          </div>
          
          <QRDownloadOptions
            onDownloadPNG={() => downloadFromUrl(generatedQRCode.png_url, `qr-${formValues.name.replace(/\s+/g, "-")}.png`)}
            onDownloadSVG={() => downloadFromUrl(generatedQRCode.svg_url, `qr-${formValues.name.replace(/\s+/g, "-")}.svg`)}
            onDownloadPDF={() => toast({ title: "PDF Export", description: "PDF export coming soon", variant: "default" })}
          />
        </Card>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleCreateAnother}>
            Create Another
          </Button>
          <Button onClick={handleViewGallery}>
            View in Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="customize" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="ai-studio" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI Studio
          </TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="customize" className="space-y-4 mt-4">
          {/* Clean Track AI Recommendation */}
          {currentWorkspace && (
            <AIStyleRecommendation 
              workspaceId={currentWorkspace.id}
              onApplyStyle={(style) => {
                setValue("primaryColor", style.primaryColor);
                setValue("secondaryColor", style.secondaryColor);
                setValue("cornerStyle", style.cornerStyle as "square" | "rounded");
                toast({
                  title: "Style Applied",
                  description: "clean track recommended style applied",
                });
              }}
            />
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name">QR Code Name *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-[10px] text-secondary-label font-medium">?</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-popover border border-border">
                      <p className="text-sm">name your qr code for tracking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="name"
                placeholder="e.g., Product Launch Campaign"
                {...register("name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantName">Variant Name (optional)</Label>
              <Input
                id="variantName"
                placeholder="e.g., booth-standee-left"
                {...register("variantName")}
              />
            </div>

            {/* Color Presets */}
            <div className="space-y-2">
              <Label>gradient presets</Label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setValue("primaryColor", "#E3EF26")}
                  className="h-10 rounded-md bg-gradient-nature-1 hover:scale-105 transition-transform"
                  title="Fresh"
                />
                <button
                  type="button"
                  onClick={() => setValue("primaryColor", "#076653")}
                  className="h-10 rounded-md bg-gradient-nature-2 hover:scale-105 transition-transform"
                  title="Balanced"
                />
                <button
                  type="button"
                  onClick={() => setValue("primaryColor", "#076653")}
                  className="h-10 rounded-md bg-gradient-nature-3 hover:scale-105 transition-transform"
                  title="Professional"
                />
                <button
                  type="button"
                  onClick={() => setValue("primaryColor", "#0C342C")}
                  className="h-10 rounded-md bg-gradient-nature-4 hover:scale-105 transition-transform"
                  title="Bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="primaryColor">primary color</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-[10px] text-secondary-label font-medium">?</span>
                      </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-popover border border-border">
                        <p className="text-sm">try a different qr style for print or digital.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    {...register("primaryColor")}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={formValues.primaryColor}
                    onChange={(e) => setValue("primaryColor", e.target.value)}
                    placeholder="#EE3B3B"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    {...register("secondaryColor")}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={formValues.secondaryColor}
                    onChange={(e) => setValue("secondaryColor", e.target.value)}
                    placeholder="#FED42F"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cornerStyle">Corner Style</Label>
              <Select
                value={formValues.cornerStyle}
                onValueChange={(value) => setValue("cornerStyle", value as "square" | "rounded")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frameText">Frame Text (optional)</Label>
              <Input
                id="frameText"
                placeholder="e.g., Scan to Learn More"
                {...register("frameText")}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-studio" className="mt-4">
          <AIStampStudio shortUrl={shortUrl} linkId={linkId} />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card className="p-6 flex flex-col items-center gap-4">
            <div className="bg-card p-4 rounded-lg">
              <QRCode
                value={(() => {
                  const match = shortUrl.match(/\/([^\/]+)\/([^\/]+)$/);
                  if (match) {
                    const [, path, slug] = match;
                    return `https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/redirect/${path}/${slug}`;
                  }
                  return shortUrl;
                })()}
                size={256}
                fgColor={formValues.primaryColor}
                bgColor="#FFFFFF"
                level="H"
                aria-label={`QR code for ${formValues.name}. Scan to visit ${shortUrl}`}
              />
            </div>
            {formValues.frameText && (
              <p className="text-sm font-medium text-center">{formValues.frameText}</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadQR("png")}
              >
                <Download className="h-4 w-4 mr-2" />
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadQR("svg")}
              >
                <Download className="h-4 w-4 mr-2" />
                SVG
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-2">
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">Name is required</p>
        )}
        <Button
          type="button"
          className="w-full"
          disabled={isGenerating}
          onClick={async () => {
            const formData = form.getValues();
            const isValid = await form.trigger();
            
            if (isValid) {
              generateQRMutation.mutate(formData);
            } else {
              console.error("❌ [QR Generation] Form validation failed", form.formState.errors);
              toast({
                title: "Validation Failed",
                description: "Please fill in all required fields",
                variant: "destructive",
              });
            }
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating QR Code...
            </>
          ) : (
            "Generate & Save QR Code"
          )}
        </Button>
      </div>
    </div>
  );
};
