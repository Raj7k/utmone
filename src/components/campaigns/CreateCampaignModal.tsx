import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { notify } from "@/lib/notify";
import { useWorkspace } from "@/hooks/workspace";
import { Loader2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppSession } from "@/contexts/AppSessionContext";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  destinationUrl: z.string().url("Must be a valid URL"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Channel {
  id: string;
  name: string;
  utmSource: string;
}

const CHANNELS: Channel[] = [
  { id: "facebook", name: "Facebook", utmSource: "facebook" },
  { id: "twitter", name: "Twitter/X", utmSource: "twitter" },
  { id: "linkedin", name: "LinkedIn", utmSource: "linkedin" },
  { id: "instagram", name: "Instagram", utmSource: "instagram" },
  { id: "email", name: "Email Newsletter", utmSource: "email" },
  { id: "google-ads", name: "Google Ads", utmSource: "google-ads" },
];

const COLOR_PRESETS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

export const CreateCampaignModal = ({ open, onOpenChange }: CreateCampaignModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const { user } = useAppSession();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      color: COLOR_PRESETS[0],
      destinationUrl: "",
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      if (!currentWorkspace) throw new Error("No workspace selected");
      if (!user) throw new Error("Not authenticated");

      // Step 1: Create campaign
      const { data: campaign, error: campaignError } = await supabaseFrom('campaigns')
        .insert({
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          name: data.name,
          color: data.color,
          status: "active",
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Step 2: Generate links for each selected channel
      const linkPromises = selectedChannels.map(async (channelId) => {
        const channel = CHANNELS.find(c => c.id === channelId);
        if (!channel) return null;

        // Add UTM parameters to destination URL
        const url = new URL(data.destinationUrl);
        url.searchParams.set("utm_source", channel.utmSource);
        url.searchParams.set("utm_medium", "campaign");
        url.searchParams.set("utm_campaign", data.name.toLowerCase().replace(/\s+/g, "-"));

        // Add unique suffix to prevent slug collisions
        const uniqueId = Math.random().toString(36).substring(2, 8);
        const slug = `${data.name.toLowerCase().replace(/\s+/g, "-")}-${channel.utmSource}-${uniqueId}`;

        // Core columns guaranteed to exist; extended columns (campaign_id,
        // final_url) tried first and dropped on PGRST204 so campaign creation
        // works on DBs that haven't run those migrations yet. Also: domain
        // should be utm.click, matching the rest of the codebase (not
        // utm.one, which was never the short-link domain).
        const corePayload = {
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          title: `${data.name} - ${channel.name}`,
          slug: slug,
          destination_url: url.toString(),
          domain: "utm.click",
        };
        const extendedPayload = {
          ...corePayload,
          campaign_id: campaign.id,
          final_url: url.toString(),
        };

        let { data: link, error: linkError } = await supabase
          .from("links")
          .insert(extendedPayload)
          .select()
          .single();

        if (linkError?.code === "PGRST204") {
          console.warn("[CreateCampaignModal] Extended link insert failed. Retrying with core columns.", linkError);
          const retry = await supabase
            .from("links")
            .insert(corePayload)
            .select()
            .single();
          link = retry.data;
          linkError = retry.error;
        }

        if (linkError) {
          console.error("[CreateCampaignModal] Link insert failed:", linkError);
          throw linkError;
        }
        return link;
      });

      await Promise.all(linkPromises);
      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      notify.success("campaign created", { description: `${selectedChannels.length} links generated successfully` });
      handleClose();
    },
    onError: (error: Error) => {
      notify.error("error", { description: error.message });
    },
  });

  const handleClose = () => {
    setStep(1);
    setSelectedChannels([]);
    form.reset();
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step === 1) {
      form.trigger(["name", "color"]).then((isValid) => {
        if (isValid) setStep(2);
      });
    } else if (step === 2) {
      form.trigger("destinationUrl").then((isValid) => {
        if (isValid) setStep(3);
      });
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (selectedChannels.length === 0) {
      notify.error("no channels selected", { description: "please select at least one channel" });
      return;
    }
    createCampaignMutation.mutate(data);
  });

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Campaign
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? "Campaign Details" : step === 2 ? "Destination URL" : "Channel Selection"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Sale 2025"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm mt-1 text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label>Campaign Color</Label>
                <div className="flex gap-2 mt-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => form.setValue("color", color)}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${form.watch("color") === color ? 'border-primary scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="destinationUrl">Destination URL</Label>
                <p className="text-xs mb-2 text-white-60">Where should this campaign send traffic?</p>
                <Input
                  id="destinationUrl"
                  type="url"
                  placeholder="https://example.com/sale"
                  {...form.register("destinationUrl")}
                />
                {form.formState.errors.destinationUrl && (
                  <p className="text-sm mt-1 text-destructive">{form.formState.errors.destinationUrl.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Select Channels</Label>
                <p className="text-xs mb-3 text-white-60">
                  We'll automatically generate a unique short link for each channel with proper UTM tags
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {CHANNELS.map((channel) => (
                    <div
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedChannels.includes(channel.id) ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                      <Checkbox
                        checked={selectedChannels.includes(channel.id)}
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{channel.name}</p>
                        <p className="text-xs text-white-60">utm_source={channel.utmSource}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedChannels.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60">
                      {selectedChannels.length} link{selectedChannels.length > 1 ? "s" : ""} will be generated
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-white/10">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={createCampaignMutation.isPending}>
                {createCampaignMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Campaign
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
