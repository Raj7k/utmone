import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "../shared/SectionCard";
import { TemplateBadge } from "../shared/TemplateBadge";
import { BulkFolderSelector } from "../BulkFolderSelector";
import { BulkTagInput } from "../BulkTagInput";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ConfigurationStepProps {
  workspaceId: string;
  templateName?: string;
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
  utmDefaults: Record<string, string>;
  onUtmChange: (field: string, value: string) => void;
  folderId: string | null;
  onFolderChange: (folderId: string | null) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  lockedFields?: string[];
}

export const ConfigurationStep = ({
  workspaceId,
  templateName,
  selectedDomain,
  onDomainChange,
  utmDefaults,
  onUtmChange,
  folderId,
  onFolderChange,
  tags,
  onTagsChange,
  lockedFields = [],
}: ConfigurationStepProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      return (data || []).filter(d => d.domain !== 'utm.one');
    },
  });

  const isLocked = (field: string) => lockedFields.includes(field);

  return (
    <div className="space-y-6">
      {templateName && (
        <div className="flex justify-center">
          <TemplateBadge templateName={templateName} />
        </div>
      )}

      <SectionCard 
        title="domain" 
        hint="your branded domain (like go.company.com) increases trust. click-through rates are 25% higher with custom domains."
      >
        <div className="space-y-2">
          <Label>custom domain *</Label>
          <Select 
            value={selectedDomain} 
            onValueChange={onDomainChange}
            disabled={isLocked('domain')}
          >
            <SelectTrigger>
              <SelectValue placeholder="select domain" />
            </SelectTrigger>
            <SelectContent>
              {verifiedDomains?.map((domain) => (
                <SelectItem key={domain.id} value={domain.domain}>
                  {domain.domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard 
        title="utm parameters" 
        hint="utm parameters help you see exactly which campaign drove each click in google analytics. leave blank to skip."
        collapsible
        defaultOpen={!templateName}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>source</Label>
            <Input
              placeholder="newsletter, linkedin, google"
              value={utmDefaults.utm_source || ""}
              onChange={(e) => onUtmChange("utm_source", e.target.value)}
              disabled={isLocked('utm_source')}
            />
          </div>
          <div className="space-y-2">
            <Label>medium</Label>
            <Input
              placeholder="email, social, cpc"
              value={utmDefaults.utm_medium || ""}
              onChange={(e) => onUtmChange("utm_medium", e.target.value)}
              disabled={isLocked('utm_medium')}
            />
          </div>
          <div className="space-y-2">
            <Label>campaign</Label>
            <Input
              placeholder="spring_sale_2024"
              value={utmDefaults.utm_campaign || ""}
              onChange={(e) => onUtmChange("utm_campaign", e.target.value)}
              disabled={isLocked('utm_campaign')}
            />
          </div>
          <div className="space-y-2">
            <Label>term</Label>
            <Input
              placeholder="running shoes"
              value={utmDefaults.utm_term || ""}
              onChange={(e) => onUtmChange("utm_term", e.target.value)}
              disabled={isLocked('utm_term')}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>content</Label>
            <Input
              placeholder="header-cta"
              value={utmDefaults.utm_content || ""}
              onChange={(e) => onUtmChange("utm_content", e.target.value)}
              disabled={isLocked('utm_content')}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard 
        title="organization" 
        hint="folders keep campaigns organized. tags let you filter links across folders—like 'q1' or 'webinar'."
        collapsible
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>folder</Label>
            <BulkFolderSelector
              value={folderId}
              onChange={onFolderChange}
            />
          </div>
          <div className="space-y-2">
            <Label>tags</Label>
            <BulkTagInput
              value={tags}
              onChange={onTagsChange}
            />
          </div>
        </div>
      </SectionCard>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full">
            <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            advanced settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SectionCard title="advanced options" hint="schedule links, set validation rules, configure notifications">
            <p className="text-sm text-muted-foreground">advanced settings will be available in step 3</p>
          </SectionCard>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
