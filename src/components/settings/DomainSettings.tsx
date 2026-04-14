import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Domain {
  id: string;
  domain: string;
  domain_settings: any;
}

interface DomainSettingsProps {
  domain: Domain;
}

export const DomainSettings = ({ domain }: DomainSettingsProps) => {
  const queryClient = useQueryClient();
  const [pathPrefix, setPathPrefix] = useState(domain.domain_settings?.path_prefix || "/");
  const [redirectType, setRedirectType] = useState(domain.domain_settings?.redirect_type || "302");
  const [enabledForNewLinks, setEnabledForNewLinks] = useState(
    domain.domain_settings?.enabled_for_new_links !== false
  );

  const updateSettings = useMutation({
    mutationFn: async () => {
      const { error } = await supabaseFrom('domains')
        .update({
          domain_settings: {
            path_prefix: pathPrefix,
            redirect_type: redirectType,
            enabled_for_new_links: enabledForNewLinks,
          },
        })
        .eq("id", domain.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-domains"] });
      notify.success("settings updated", { description: "domain settings have been saved successfully." });
    },
    onError: (error: Error) => {
      notify.error("error", { description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Settings</CardTitle>
        <CardDescription>
          Configure default behavior for {domain.domain}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="path-prefix">Default Path Prefix</Label>
          <Input
            id="path-prefix"
            value={pathPrefix}
            onChange={(e) => setPathPrefix(e.target.value)}
            placeholder="/go/"
          />
          <p className="text-sm text-muted-foreground">
            Example: {domain.domain}{pathPrefix}your-slug
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirect-type">Redirect Type</Label>
          <Select value={redirectType} onValueChange={setRedirectType}>
            <SelectTrigger id="redirect-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="302">302 Temporary (Recommended)</SelectItem>
              <SelectItem value="301">301 Permanent</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            302 allows you to change destination URLs later. 301 is cached by browsers.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="enabled-for-new-links">Enable for New Links</Label>
            <p className="text-sm text-muted-foreground">
              Show this domain as an option when creating new links
            </p>
          </div>
          <Switch
            id="enabled-for-new-links"
            checked={enabledForNewLinks}
            onCheckedChange={setEnabledForNewLinks}
          />
        </div>

        <Button
          onClick={() => updateSettings.mutate()}
          disabled={updateSettings.isPending}
          className="w-full"
        >
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};
