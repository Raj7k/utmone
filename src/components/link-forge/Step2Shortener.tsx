import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, ArrowLeft, Shuffle, CheckCircle2, AlertCircle, Globe, AlertTriangle, Route, Briefcase, Bell, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateSlugFromTitle } from "@/lib/slugify";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLinkWebhooks } from "@/hooks/useLinkWebhooks";
import { useActivationTracking } from "@/hooks/useActivationTracking";
import { GeoTargetingModal } from "./GeoTargetingModal";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { useUserWorkspaceRole, requiresApproval } from "@/hooks/useUserWorkspaceRole";
import { DestinationRotator } from "@/components/links/DestinationRotator";
import { Destination } from "@/hooks/useSmartRotator";
import { Switch } from "@/components/ui/switch";

const shortenerSchema = z.object({
  title: z.string().min(1, "title is required").max(100),
  slug: z.string().min(3, "slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "only lowercase letters, numbers, and hyphens"),
  expires_at: z.string().optional(),
  max_clicks: z.number().min(1, "Must be at least 1").max(10000000, "Cannot exceed 10 million").optional().or(z.literal(NaN)),
  fallback_url: z.string().url().optional().or(z.literal("")),
});

type ShortenerFormData = z.infer<typeof shortenerSchema>;

interface Step2ShortenerProps {
  workspaceId: string;
  utmUrl: string;
  originalUrl: string;
  onComplete: (linkId: string, shortUrl: string) => void;
  onBack: () => void;
}

export const Step2Shortener = ({
  workspaceId,
  utmUrl,
  onComplete,
  onBack,
}: Step2ShortenerProps) => {
  const queryClient = useQueryClient();
  const { triggerWebhook } = useLinkWebhooks(workspaceId);
  const { trackFirstLink } = useActivationTracking();
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("utm.click");
  const [geoTargets, setGeoTargets] = useState<Record<string, string>>({});
  const [showGeoModal, setShowGeoModal] = useState(false);
  
  // Multiple destinations / A/B testing state
  const [destinations, setDestinations] = useState<Destination[]>([
    { url: utmUrl, weight: 100, clicks: 0, conversions: 0 }
  ]);
  const [smartRotate, setSmartRotate] = useState(false);
  const [contextualRouting, setContextualRouting] = useState(false);
  
  // Sales Mode state
  const [isSalesLink, setIsSalesLink] = useState(false);
  const [prospectName, setProspectName] = useState("");
  const [alertOnClick, setAlertOnClick] = useState(true);
  
  // Check user role for approval workflow
  const { data: userRole } = useUserWorkspaceRole(workspaceId);
  const needsApproval = requiresApproval(userRole);
  
  // Slug checking state
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  // Fetch verified domains for this workspace + system-level defaults
  const { data: verifiedDomains } = useQuery({
    queryKey: ["verified-domains", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("id, domain, workspace_id")
        .eq("is_verified", true)
        .or(`workspace_id.eq.${workspaceId},is_system_domain.eq.true`)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      // Filter out utm.one (main website) and return only shortener domains
      return (data || []).filter(d => d.domain !== 'utm.one');
    },
  });

  const form = useForm<ShortenerFormData>({
    resolver: zodResolver(shortenerSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const values = form.watch();

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title) {
        const generatedSlug = generateSlugFromTitle(value.title);
        form.setValue("slug", generatedSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Check slug availability with loading state
  useEffect(() => {
    if (!values.slug || values.slug.length < 3) {
      setSlugAvailable(null);
      setIsCheckingSlug(false);
      return;
    }
    
    setIsCheckingSlug(true);
    setSlugAvailable(null);
    
    const checkSlug = async () => {
      const { data } = await supabase
        .from("links")
        .select("id")
        .eq("domain", selectedDomain)
        .eq("path", "")
        .eq("slug", values.slug)
        .maybeSingle();

      setSlugAvailable(!data);
      setIsCheckingSlug(false);
    };

    const timeoutId = setTimeout(checkSlug, 400);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [values.slug, selectedDomain]);

  const generateRandomSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 10);
    form.setValue("slug", randomSlug);
  };

  const createLinkMutation = useMutation({
    mutationFn: async (data: ShortenerFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

      // Prepare destinations data for storage
      const hasMultipleDestinations = destinations.length > 1;
      const destinationsData = hasMultipleDestinations ? JSON.parse(JSON.stringify(destinations)) : null;

      const { data: link, error } = await supabase
        .from("links")
        .insert({
          workspace_id: workspaceId,
          created_by: user.id,
          title: data.title,
          slug: data.slug,
          destination_url: destinations[0]?.url || utmUrl,
          final_url: destinations[0]?.url || utmUrl,
          domain: selectedDomain,
          path: "",
          expires_at: data.expires_at || null,
          max_clicks: data.max_clicks || null,
          fallback_url: data.fallback_url || null,
          geo_targets: Object.keys(geoTargets).length > 0 ? geoTargets : null,
          destinations: destinationsData,
          smart_rotate: hasMultipleDestinations ? smartRotate : false,
          contextual_routing: hasMultipleDestinations ? contextualRouting : false,
          status: needsApproval ? 'pending' : 'active',
          approval_status: needsApproval ? 'pending' : 'approved',
          submitted_for_approval_at: needsApproval ? new Date().toISOString() : null,
          // Sales Mode fields
          link_type: isSalesLink ? 'sales' : 'marketing',
          prospect_name: isSalesLink ? prospectName : null,
          alert_on_click: isSalesLink ? alertOnClick : false,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Trigger webhook for link.created
      try {
        await triggerWebhook('link.created', {
          link_id: link.id,
          title: link.title,
          short_url: `https://${link.domain}/${link.slug}`,
          destination_url: link.destination_url,
          created_at: link.created_at,
        });
      } catch (webhookError) {
        console.error('Webhook trigger failed:', webhookError);
      }
      
      return link;
    },
    onSuccess: async (link) => {
      const shortUrl = `https://${link.domain}/${link.slug}`;
      
      // Track first link for onboarding
      trackFirstLink();
      
      // Invalidate and refetch onboarding progress immediately
      await queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      await queryClient.refetchQueries({ queryKey: ["onboarding-progress"] });
      
      // Invalidate links-count to disable demo mode
      queryClient.invalidateQueries({ queryKey: ["links-count"] });
      
      notify.success(needsApproval ? "approval requested" : "link created");
      
      // Auto-scroll to recent links section
      setTimeout(() => {
        const recentLinksSection = document.getElementById("recent-links");
        if (recentLinksSection) {
          recentLinksSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 300);
      
      onComplete(link.id, shortUrl);
    },
    onError: (error: any) => {
      const message = getFriendlyErrorMessage(error);
      notify.error(message);
      // Reset slug check to force re-validation
      setSlugAvailable(null);
    },
  });

  const onSubmit = async (data: ShortenerFormData) => {
    // Prevent double-submission
    if (createLinkMutation.isPending) return;
    
    // Final synchronous slug check before submission
    const { data: existing } = await supabase
      .from("links")
      .select("id")
      .eq("domain", selectedDomain)
      .eq("path", "")
      .eq("slug", data.slug)
      .maybeSingle();
    
    if (existing) {
      setSlugAvailable(false);
      notify.error("this short link already exists. please try a different slug.");
      return;
    }
    
    createLinkMutation.mutate(data);
  };

  // Keyboard shortcut for opening geo-targeting modal (G key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') {
        // Only trigger if not typing in an input/textarea
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          setShowGeoModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const geoRuleCount = Object.keys(geoTargets).length;

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-primary" />
            <h2 className="text-title-2 font-semibold heading">shorten your url</h2>
          </div>
          <p className="text-body-apple text-secondary-label">
            create a short, memorable link
          </p>
        </div>

        {needsApproval && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Your role requires admin approval before links go live.
            </p>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <Label className="text-xs text-secondary-label">utm url from step 1</Label>
          <p className="text-sm font-mono text-label mt-1 break-all">{utmUrl}</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">link title *</Label>
            <Input
              id="title"
              placeholder="summer campaign 2024"
              {...form.register("title")}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="domain">domain</Label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full mt-1.5 h-10 px-3 rounded-md border border-input bg-background"
            >
              {verifiedDomains?.map((d) => (
                <option key={d.id} value={d.domain}>
                  {d.domain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="slug">custom slug *</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-body-apple text-secondary-label">{selectedDomain}/</span>
              <div className="flex-1 relative">
                <Input
                  id="slug"
                  placeholder="my-link"
                  {...form.register("slug")}
                />
                {values.slug && values.slug.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingSlug && (
                      <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                    )}
                    {!isCheckingSlug && slugAvailable === true && (
                      <CheckCircle2 className="h-4 w-4 text-system-green" />
                    )}
                    {!isCheckingSlug && slugAvailable === false && (
                      <AlertCircle className="h-4 w-4 text-system-red" />
                    )}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generateRandomSlug}
                title="generate random slug"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            {form.formState.errors.slug && (
              <p className="text-xs text-system-red mt-1">
                {form.formState.errors.slug.message}
              </p>
            )}
            {slugAvailable === false && (
              <p className="text-xs text-system-red mt-1">
                this slug is already taken
              </p>
            )}
          </div>

          {/* Geo-Targeting Button */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGeoModal(true)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Geo-Targeting
                <span className="text-xs text-muted-foreground">(Press G)</span>
              </span>
              {geoRuleCount > 0 && (
                <BadgeComponent variant="secondary" className="ml-2">
                  {geoRuleCount} {geoRuleCount === 1 ? 'Rule' : 'Rules'} Active
                </BadgeComponent>
              )}
            </Button>
          </div>

          {/* Sales Mode Toggle */}
          <div className="p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">sales link</p>
                  <p className="text-xs text-muted-foreground">track prospect engagement with instant alerts</p>
                </div>
              </div>
              <Switch
                checked={isSalesLink}
                onCheckedChange={(checked) => {
                  setIsSalesLink(checked);
                  if (checked) setAlertOnClick(true);
                }}
              />
            </div>
            
            {isSalesLink && (
              <div className="mt-4 space-y-4 pt-4 border-t border-border">
                <div>
                  <Label htmlFor="prospect-name" className="text-sm text-muted-foreground">
                    who is this for?
                  </Label>
                  <Input
                    id="prospect-name"
                    placeholder="e.g., John Doe - Acme Corp"
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    this name will appear in your alerts
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">instant email alerts</span>
                  </div>
                  <Switch
                    checked={alertOnClick}
                    onCheckedChange={setAlertOnClick}
                  />
                </div>
              </div>
            )}
          </div>

          <Accordion type="multiple" className="overflow-hidden space-y-2">
            {/* A/B Testing / Multiple Destinations */}
            <AccordionItem value="ab-testing" className="border rounded-lg">
              <AccordionTrigger className="text-sm px-4">
                <span className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  a/b testing & contextual routing
                  {destinations.length > 1 && (
                    <BadgeComponent variant="secondary" className="ml-2">
                      {destinations.length} destinations
                    </BadgeComponent>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <DestinationRotator
                  destinations={destinations}
                  onChange={setDestinations}
                  smartRotate={smartRotate}
                  onSmartRotateChange={setSmartRotate}
                  contextualRouting={contextualRouting}
                  onContextualRoutingChange={setContextualRouting}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Advanced Options */}
            <AccordionItem value="advanced" className="border rounded-lg">
              <AccordionTrigger className="text-sm px-4">advanced options</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-4 pb-4 w-full overflow-hidden">
                <div className="w-full">
                  <Label htmlFor="expires_at">expiry date (optional)</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    {...form.register("expires_at")}
                    className="mt-1.5 w-full"
                  />
                </div>

                <div className="w-full">
                  <Label htmlFor="max_clicks">max clicks (optional)</Label>
                  <Input
                    id="max_clicks"
                    type="number"
                    placeholder="1000"
                    {...form.register("max_clicks", { valueAsNumber: true })}
                    className="mt-1.5 w-full"
                  />
                  <p className="text-xs text-secondary-label mt-1">
                    Limit total clicks for this link (leave empty for unlimited)
                  </p>
                  {form.formState.errors.max_clicks && (
                    <p className="text-xs text-system-red mt-1">
                      {form.formState.errors.max_clicks.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="fallback_url">fallback url (optional)</Label>
                  <Input
                    id="fallback_url"
                    placeholder="https://example.com/expired"
                    {...form.register("fallback_url")}
                    className="mt-1.5 w-full"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={createLinkMutation.isPending || isCheckingSlug || slugAvailable === false}
          >
            {createLinkMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                creating...
              </>
            ) : needsApproval ? (
              "request approval"
            ) : (
              "create short link"
            )}
          </Button>
        </div>
      </form>

      <GeoTargetingModal
        open={showGeoModal}
        onOpenChange={setShowGeoModal}
        geoTargets={geoTargets}
        onSave={setGeoTargets}
      />
    </>
  );
};
