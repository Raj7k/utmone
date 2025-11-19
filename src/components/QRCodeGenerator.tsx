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
import { Download, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [isGenerating, setIsGenerating] = useState(false);

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

  const { register, watch, setValue } = form;
  const formValues = watch();

  const generateQRMutation = useMutation({
    mutationFn: async (data: QRFormData) => {
      setIsGenerating(true);

      // Generate PNG using qrcode library
      const pngDataUrl = await QRCodeLib.toDataURL(shortUrl, {
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
      const svgString = await QRCodeLib.toString(shortUrl, {
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

      if (pngError) throw pngError;

      const { error: svgError } = await supabase.storage
        .from("qr-codes")
        .upload(svgPath, svgBlob);

      if (svgError) throw svgError;

      // Get public URLs
      const { data: pngUrlData } = supabase.storage
        .from("qr-codes")
        .getPublicUrl(pngPath);

      const { data: svgUrlData } = supabase.storage
        .from("qr-codes")
        .getPublicUrl(svgPath);

      // Save to database
      const { data: qrCode, error: dbError } = await supabase
        .from("qr_codes")
        .insert({
          link_id: linkId,
          name: data.name,
          variant_name: data.variantName,
          primary_color: data.primaryColor,
          secondary_color: data.secondaryColor,
          corner_style: data.cornerStyle,
          frame_text: data.frameText,
          has_logo: data.hasLogo,
          png_url: pngUrlData.publicUrl,
          svg_url: svgUrlData.publicUrl,
          created_by: (await supabase.auth.getUser()).data.user?.id!,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return qrCode;
    },
    onSuccess: () => {
      toast({
        title: "QR Code Generated",
        description: "Your branded QR code has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["qr-codes", linkId] });
      setIsGenerating(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const downloadQR = async (format: "png" | "svg") => {
    try {
      let dataUrl: string;
      let filename: string;

      if (format === "png") {
        dataUrl = await QRCodeLib.toDataURL(shortUrl, {
          width: 1024,
          margin: 2,
          color: {
            dark: formValues.primaryColor,
            light: "#FFFFFF",
          },
        });
        filename = `qr-${formValues.name.replace(/\s+/g, "-")}.png`;
      } else {
        const svgString = await QRCodeLib.toString(shortUrl, {
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="customize" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="customize" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">QR Code Name *</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
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

        <TabsContent value="preview" className="mt-4">
          <Card className="p-6 flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCode
                value={shortUrl}
                size={256}
                fgColor={formValues.primaryColor}
                bgColor="#FFFFFF"
                level="H"
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

      <div className="flex justify-end gap-2">
        <Button
          onClick={onSubmit}
          disabled={isGenerating}
        >
          {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Generate & Save QR Code
        </Button>
      </div>
    </div>
  );
};
