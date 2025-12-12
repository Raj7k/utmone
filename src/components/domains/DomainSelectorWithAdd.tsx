import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DomainSetupWizard } from "./DomainSetupWizard";
import { cn } from "@/lib/utils";

interface DomainSelectorWithAddProps {
  value: string;
  onChange: (value: string) => void;
  workspaceId: string;
  className?: string;
  placeholder?: string;
}

export const DomainSelectorWithAdd = ({
  value,
  onChange,
  workspaceId,
  className,
  placeholder = "select domain",
}: DomainSelectorWithAddProps) => {
  const [showWizard, setShowWizard] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Fetch verified domains for this workspace + system-level defaults
  const { data: verifiedDomains, refetch } = useQuery({
    queryKey: ["verified-domains", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("id, domain, workspace_id, is_primary")
        .eq("is_verified", true)
        .or(`workspace_id.eq.${workspaceId},is_system_domain.eq.true`)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      // Filter out utm.one (main website) and return only shortener domains
      return (data || []).filter(d => d.domain !== 'utm.one');
    },
    enabled: !!workspaceId,
  });

  const handleDomainAdded = (domain: string) => {
    refetch().then(() => {
      onChange(domain);
    });
  };

  const handleAddDomainClick = () => {
    setIsSelectOpen(false);
    // Small delay to ensure select closes before wizard opens
    setTimeout(() => {
      setShowWizard(true);
    }, 100);
  };

  // Separate workspace domains from system domains
  const workspaceDomains = verifiedDomains?.filter(d => d.workspace_id === workspaceId) || [];
  const systemDomains = verifiedDomains?.filter(d => d.workspace_id !== workspaceId) || [];

  return (
    <>
      <Select 
        value={value} 
        onValueChange={onChange}
        open={isSelectOpen}
        onOpenChange={setIsSelectOpen}
      >
        <SelectTrigger className={cn("mt-1.5", className)}>
          <SelectValue placeholder={placeholder}>
            {value && (
              <span className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                {value}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Workspace Custom Domains */}
          {workspaceDomains.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                your domains
              </div>
              {workspaceDomains.map((d) => (
                <SelectItem key={d.id} value={d.domain}>
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    {d.domain}
                    {d.is_primary && (
                      <span className="text-xs text-muted-foreground">(primary)</span>
                    )}
                  </span>
                </SelectItem>
              ))}
              <Separator className="my-1" />
            </>
          )}

          {/* System Domains */}
          {systemDomains.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                default domains
              </div>
              {systemDomains.map((d) => (
                <SelectItem key={d.id} value={d.domain}>
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    {d.domain}
                  </span>
                </SelectItem>
              ))}
              <Separator className="my-1" />
            </>
          )}

          {/* Add Domain Option */}
          <div
            className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
            onClick={handleAddDomainClick}
          >
            <Plus className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">add your domain</span>
          </div>
        </SelectContent>
      </Select>

      <DomainSetupWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        workspaceId={workspaceId}
        onDomainAdded={handleDomainAdded}
      />
    </>
  );
};
